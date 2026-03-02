import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from 'reactflow';
import { useStore } from '../store/useStore';

export default function ButtonEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
  label,
  data
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = useStore((state) => state.removeEdge);
  const isDirectlySelected = data?.isDirectlySelected;
  const isConnectedToSelectedTable = data?.isConnectedToSelectedTable;
  const showLabel = isDirectlySelected || isConnectedToSelectedTable;
  const displayLabel = data?.label || label;

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    removeEdge(source, target);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {showLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              zIndex: 1000, // 確実に最前面に持ってくる
            }}
            className="nodrag nopan"
          >
            {displayLabel && (
              <div className="bg-slate-800 px-2 py-1 rounded-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 shadow-lg shadow-black/50 whitespace-nowrap mb-1">
                {displayLabel}
              </div>
            )}
            
            {isDirectlySelected && (
              <button
                className="w-[28px] h-[28px] bg-[#ef4444] text-white rounded-full flex items-center justify-center border-2 border-white shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-transform active:scale-95 cursor-pointer"
                onClick={onEdgeClick}
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag start when clicking delete
                title="Delete relationship"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
