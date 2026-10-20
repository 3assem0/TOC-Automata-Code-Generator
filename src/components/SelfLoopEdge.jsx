import React from 'react';
import { BaseEdge, EdgeLabelRenderer, useStore } from 'reactflow';

/**
 * Edge for transitions from a state back to itself.
 * Draws a loop above the state circle (React Flow's built-in edges collapse to a stub).
 */
const SelfLoopEdge = ({ id, source, label, style, markerEnd }) => {
  const node = useStore((s) => s.nodeInternals.get(source));
  if (!node) return null;

  const { x, y } = node.positionAbsolute || node.position;
  const width = node.width || 50;
  const cx = x + width / 2;
  const top = y;
  const spread = 14;
  const height = 55;

  const path = `M ${cx - spread} ${top} C ${cx - spread - 30} ${top - height}, ${cx + spread + 30} ${top - height}, ${cx + spread} ${top}`;

  return (
    <>
      <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="self-loop-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -100%) translate(${cx}px, ${top - height + 10}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default SelfLoopEdge;
