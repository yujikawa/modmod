import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from 'reactflow';

export default function ButtonEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  markerStart,
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

  const isDirectlySelected = data?.isDirectlySelected;
  const isConnectedToSelectedTable = data?.isConnectedToSelectedTable;
  const showLabel = isDirectlySelected || isConnectedToSelectedTable;
  const displayLabel = data?.label || label;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} markerStart={markerStart} style={style} />
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
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
