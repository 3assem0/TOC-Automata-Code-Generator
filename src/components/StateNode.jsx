import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Custom node component for automata states
 * Displays state name and visual indicators for start/accepting states
 */
const StateNode = ({ data, isConnectable }) => {
  const { label, isStart, isAccepting } = data;

  return (
    <div className="state-node">
      {/* Start state indicator (arrow pointing to state) */}
      {isStart && (
        <div className="start-indicator">
          <svg width="40" height="20" style={{ position: 'absolute', left: '-45px', top: '15px' }}>
            <defs>
              <marker
                id="arrowhead-start"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="var(--text-primary)" />
              </marker>
            </defs>
            <line
              x1="0"
              y1="10"
              x2="35"
              y2="10"
              stroke="var(--text-primary)"
              strokeWidth="2"
              markerEnd="url(#arrowhead-start)"
            />
          </svg>
        </div>
      )}

      {/* Main state circle */}
      <div className={`state-circle ${isAccepting ? 'accepting' : ''}`}>
        <div className="state-label">{label}</div>
        
        {/* Double circle for accepting states */}
        {isAccepting && <div className="accepting-circle" style={{ borderColor: 'var(--text-primary)' }}></div>}
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        className="node-handle"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        className="node-handle"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="node-handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="node-handle"
      />
    </div>
  );
};

export default memo(StateNode);
