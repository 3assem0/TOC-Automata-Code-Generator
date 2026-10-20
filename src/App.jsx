import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'reactflow';
import AutomataEditor from './components/AutomataEditor';
import ControlPanel from './components/ControlPanel';
import CodeGenerator from './components/CodeGenerator';
import Simulator from './components/Simulator';
import ExampleLoader from './components/ExampleLoader';
import { getExample } from './utils/exampleAutomata';
import { extractAlphabet } from './utils/automataValidator';
import './App.css';

let nodeId = 0;
const getNodeId = () => `q${nodeId++}`;

// Self-loops need their own edge type; React Flow's smoothstep collapses them to a stub
const makeEdge = (props) => ({
  ...props,
  type: props.source === props.target ? 'selfLoop' : 'smoothstep',
});

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const [highlightedStates, setHighlightedStates] = useState([]);
  const [automata, setAutomata] = useState({
    states: [],
    alphabet: [],
    start: null,
    accepting: [],
    transitions: {}
  });

  // Update automata data structure from nodes and edges
  const updateAutomata = useCallback((currentNodes, currentEdges) => {
    const states = currentNodes.map(n => n.id);
    const start = currentNodes.find(n => n.data.isStart)?.id || null;
    const accepting = currentNodes.filter(n => n.data.isAccepting).map(n => n.id);
    
    // Build transitions from edges
    const transitions = {};
    states.forEach(state => {
      transitions[state] = {};
    });

    currentEdges.forEach(edge => {
      const source = edge.source;
      const target = edge.target;
      const label = edge.label || '';
      
      if (label) {
        // Handle multiple symbols separated by commas
        const symbols = label.split(',').map(s => s.trim()).filter(s => s);
        
        symbols.forEach(symbol => {
          if (!transitions[source][symbol]) {
            transitions[source][symbol] = target;
          } else {
            // Convert to array for NFA (multiple transitions for same symbol)
            if (!Array.isArray(transitions[source][symbol])) {
              transitions[source][symbol] = [transitions[source][symbol]];
            }
            if (!transitions[source][symbol].includes(target)) {
              transitions[source][symbol].push(target);
            }
          }
        });
      }
    });

    const alphabet = extractAlphabet(transitions);

    const next = { states, alphabet, start, accepting, transitions };
    setAutomata(prev => JSON.stringify(prev) === JSON.stringify(next) ? prev : next);
  }, []);

  // Keep the automaton in sync with the canvas, including deletions made with the Delete/Backspace key
  useEffect(() => {
    updateAutomata(nodes, edges);
  }, [nodes, edges, updateAutomata]);

  // Add new state
  const handleAddState = useCallback((stateName) => {
    const id = stateName || getNodeId();
    if (nodes.some(n => n.id === id)) {
      alert(`State '${id}' already exists`);
      return;
    }
    const newNode = {
      id,
      type: 'stateNode',
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: id,
        isStart: nodes.length === 0, // First state is start by default
        isAccepting: false
      },
    };
    
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
  }, [nodes, edges, setNodes]);

  // Remove state
  const handleRemoveState = useCallback((stateId) => {
    const updatedNodes = nodes.filter(n => n.id !== stateId);
    const updatedEdges = edges.filter(e => e.source !== stateId && e.target !== stateId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNodeId(null);
  }, [nodes, edges, setNodes, setEdges]);

  // Set start state
  const handleSetStart = useCallback((stateId) => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isStart: node.id === stateId
      }
    }));
    setNodes(updatedNodes);
  }, [nodes, edges, setNodes]);

  // Toggle accepting state
  const handleSetAccepting = useCallback((stateId) => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isAccepting: node.id === stateId ? !node.data.isAccepting : node.data.isAccepting
      }
    }));
    setNodes(updatedNodes);
  }, [nodes, edges, setNodes]);

  // Handle edge connection
  const onConnect = useCallback((params) => {
    // Prompt for transition symbol
    const symbol = prompt('Enter transition symbol (use ε for epsilon, separate multiple with commas):');
    if (symbol !== null && symbol.trim()) {
      const existing = edges.find(e => e.source === params.source && e.target === params.target);
      const updatedEdges = existing
        ? edges.map(e => e.id === existing.id ? { ...e, label: `${e.label}, ${symbol.trim()}` } : e)
        : addEdge(makeEdge({ ...params, label: symbol.trim() }), edges);
      setEdges(updatedEdges);
    }
  }, [edges, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Handle edge click
  const handleEdgeClick = useCallback((event, edge) => {
    const newLabel = prompt('Edit transition symbol:', edge.label || '');
    if (newLabel !== null) {
      const updatedEdges = edges.map(e => 
        e.id === edge.id ? { ...e, label: newLabel } : e
      );
      setEdges(updatedEdges);
    }
  }, [edges, setEdges]);

  // Export as JSON
  const handleExportJSON = useCallback(() => {
    const exportData = {
      ...automata,
      positions: {}
    };
    
    nodes.forEach(node => {
      exportData.positions[node.id] = node.position;
    });

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'automaton.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [automata, nodes]);

  // Clear all
  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setHighlightedStates([]);
    nodeId = 0;
  }, [setNodes, setEdges]);

  // Load example
  const handleLoadExample = useCallback((exampleKey) => {
    const example = getExample(exampleKey);
    if (!example) return;

    // Create nodes from example
    const newNodes = example.states.map(stateId => ({
      id: stateId,
      type: 'stateNode',
      position: example.positions[stateId] || { x: Math.random() * 400, y: Math.random() * 300 },
      data: {
        label: stateId,
        isStart: stateId === example.start,
        isAccepting: example.accepting.includes(stateId)
      }
    }));

    // Create edges from transitions
    const edgeMap = new Map();
    
    for (const source in example.transitions) {
      for (const symbol in example.transitions[source]) {
        const targets = example.transitions[source][symbol];
        const targetArray = Array.isArray(targets) ? targets : [targets];
        
        targetArray.forEach(target => {
          const key = `${source}->${target}`;
          if (edgeMap.has(key)) {
            edgeMap.get(key).label += `, ${symbol}`;
          } else {
            // Route state-to-state edges side to side so they don't collide with self-loops on top
            edgeMap.set(key, makeEdge({ id: `e${edgeMap.size}`, source, target, label: symbol, sourceHandle: 'right', targetHandle: 'left' }));
          }
        });
      }
    }
    const newEdges = [...edgeMap.values()];

    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNodeId(null);
    setHighlightedStates([]);
  }, [setNodes, setEdges]);

  return (
    <div className="app">
      <header className="app-header">
        <h1> Automata Code Generator</h1>
        <p>Design finite automata visually and generate working code</p>
      </header>

      <div className="app-content">
        <aside className="sidebar left-sidebar">
          <ControlPanel
            onAddState={handleAddState}
            onRemoveState={handleRemoveState}
            onSetStart={handleSetStart}
            onSetAccepting={handleSetAccepting}
            onExportJSON={handleExportJSON}
            onClear={handleClear}
            selectedNode={selectedNode}
            automata={automata}
          />
        </aside>

        <main className="main-content">
          <AutomataEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            highlightedStates={highlightedStates}
          />
        </main>

        <aside className="sidebar right-sidebar">
          <ExampleLoader onLoadExample={handleLoadExample} />
          
          <Simulator 
            automata={automata}
            onStateHighlight={setHighlightedStates}
          />
          
          <CodeGenerator automata={automata} />
        </aside>
      </div>
    </div>
  );
}

export default App;
