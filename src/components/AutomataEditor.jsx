import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import StateNode from './StateNode';

const nodeTypes = {
  stateNode: StateNode,
};

/**
 * Main automata editor component using React Flow
 * Handles visual editing of finite automata
 */
const AutomataEditor = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect,
  onNodeClick,
  onEdgeClick,
  onEdgeUpdate,
  highlightedStates 
}) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Update node styles based on highlighted states
  const getNodeStyle = useCallback((nodeId) => {
    if (highlightedStates && highlightedStates.includes(nodeId)) {
      return {
        background: 'var(--highlight-color)',
        boxShadow: '0 0 20px var(--highlight-color)',
      };
    }
    return {};
  }, [highlightedStates]);

  // Apply highlighting to nodes
  const styledNodes = nodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      ...getNodeStyle(node.id),
    }
  }));

  const defaultEdgeOptions = {
    animated: false,
    style: { stroke: 'var(--text-secondary)', strokeWidth: 1.5 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'var(--text-secondary)',
    },
  };

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  return (
    <div className="automata-editor">
      <ReactFlowProvider>
        <ReactFlow
          nodes={styledNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onEdgeUpdate={onEdgeUpdate}
          onInit={onInit}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#e2e8f0" gap={20} size={1} />
          <Controls className="bg-white border-gray-200 shadow-sm" />
          <MiniMap
            nodeColor={(node) => {
              if (node.data.isStart) return 'var(--primary-color)';
              if (node.data.isAccepting) return 'var(--success-color)';
              return '#fff';
            }}
            maskColor="rgba(248, 249, 254, 0.8)"
            style={{ backgroundColor: 'transparent' }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default AutomataEditor;
