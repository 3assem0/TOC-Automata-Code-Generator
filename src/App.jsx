import React, { useState, useCallback } from 'react';
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

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
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

    setAutomata({
      states,
      alphabet,
      start,
      accepting,
      transitions
    });
  }, []);

  // Add new state
  const handleAddState = useCallback((stateName) => {
    const id = stateName || getNodeId();
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
    updateAutomata(updatedNodes, edges);
  }, [nodes, edges, setNodes, updateAutomata]);

  // Remove state
  const handleRemoveState = useCallback((stateId) => {
    const updatedNodes = nodes.filter(n => n.id !== stateId);
    const updatedEdges = edges.filter(e => e.source !== stateId && e.target !== stateId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNode(null);
    updateAutomata(updatedNodes, updatedEdges);
  }, [nodes, edges, setNodes, setEdges, updateAutomata]);

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
    updateAutomata(updatedNodes, edges);
  }, [nodes, edges, setNodes, updateAutomata]);

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
    updateAutomata(updatedNodes, edges);
  }, [nodes, edges, setNodes, updateAutomata]);

  // Handle edge connection
  const onConnect = useCallback((params) => {
    // Prompt for transition symbol
    const symbol = prompt('Enter transition symbol (use ε for epsilon, separate multiple with commas):');
    if (symbol !== null) {
      const newEdge = {
        ...params,
        label: symbol,
        type: 'smoothstep',
      };
      const updatedEdges = addEdge(newEdge, edges);
      setEdges(updatedEdges);
      updateAutomata(nodes, updatedEdges);
    }
  }, [edges, nodes, setEdges, updateAutomata]);

  // Handle node click
  const handleNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Handle edge click
  const handleEdgeClick = useCallback((event, edge) => {
    const newLabel = prompt('Edit transition symbol:', edge.label || '');
    if (newLabel !== null) {
      const updatedEdges = edges.map(e => 
        e.id === edge.id ? { ...e, label: newLabel } : e
      );
      setEdges(updatedEdges);
      updateAutomata(nodes, updatedEdges);
    }
  }, [edges, nodes, setEdges, updateAutomata]);

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
    setSelectedNode(null);
    setHighlightedStates([]);
    nodeId = 0;
    updateAutomata([], []);
  }, [setNodes, setEdges, updateAutomata]);

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
    const newEdges = [];
    let edgeId = 0;
    
    for (const source in example.transitions) {
      for (const symbol in example.transitions[source]) {
        const targets = example.transitions[source][symbol];
        const targetArray = Array.isArray(targets) ? targets : [targets];
        
        targetArray.forEach(target => {
          newEdges.push({
            id: `e${edgeId++}`,
            source,
            target,
            label: symbol,
            type: 'smoothstep',
          });
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(null);
    setHighlightedStates([]);
    updateAutomata(newNodes, newEdges);
  }, [setNodes, setEdges, updateAutomata]);

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
