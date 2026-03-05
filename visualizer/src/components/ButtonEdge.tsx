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

  const { theme } = useStore();
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
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            {displayLabel && (
              <div className={`px-2 py-1 rounded-md text-[10px] font-bold border shadow-lg whitespace-nowrap mb-1 transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/30 shadow-black/50' 
                  : 'bg-white text-emerald-600 border-emerald-200 shadow-slate-200'
              }`}>
                {displayLabel}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
