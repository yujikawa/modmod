import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Position,
  type EdgeProps,
} from 'reactflow';
import { useStore } from '../store/useStore';

// Helper to parse cardinality label into [source, target] symbols
const parseCardinality = (label: string): [string, string] => {
  if (!label) return ['', ''];
  const lower = label.toLowerCase();
  const parts = lower.split('-to-');
  if (parts.length !== 2) return ['', ''];
  
  return parts.map(p => {
    if (p.includes('one')) return '1';
    if (p.includes('many')) return 'N';
    return '';
  }) as [string, string];
};

// Helper to get offset position from an endpoint
const getBadgePosition = (
  x: number, 
  y: number, 
  position: Position, 
  offset: number = 45
) => {
  switch (position) {
    case Position.Top: return { x, y: y - offset };
    case Position.Bottom: return { x, y: y + offset };
    case Position.Left: return { x: x - offset, y };
    case Position.Right: return { x: x + offset, y };
    default: return { x, y };
  }
};

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
  const [edgePath] = getSmoothStepPath({
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
  const isHighVisibility = isDirectlySelected || isConnectedToSelectedTable;
  
  const displayLabel = data?.label || label || '';
  const [sourceSymbol, targetSymbol] = parseCardinality(displayLabel);

  const sourceBadgePos = getBadgePosition(sourceX, sourceY, sourcePosition);
  const targetBadgePos = getBadgePosition(targetX, targetY, targetPosition);

  const Badge = ({ x, y, symbol }: { x: number, y: number, symbol: string }) => {
    if (!symbol) return null;
    
    const isOne = symbol === '1';
    const baseClasses = `
      absolute flex items-center justify-center 
      w-5 h-5 text-[9px] font-black border shadow-sm
      backdrop-blur-sm transition-all duration-300
      select-none pointer-events-none z-[100]
    `;
    
    const themeClasses = theme === 'dark'
      ? isHighVisibility 
        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 opacity-100 scale-110 shadow-emerald-500/20'
        : 'bg-slate-800/60 text-slate-300 border-slate-600/50 opacity-70'
      : isHighVisibility
        ? 'bg-emerald-600 text-white border-emerald-200 opacity-100 scale-110 shadow-emerald-500/30'
        : 'bg-white/80 text-slate-500 border-slate-300/50 opacity-80 shadow-sm';

    const shapeClasses = isOne ? 'rounded-full' : 'rounded-[4px]';

    return (
      <div
        className={`${baseClasses} ${themeClasses} ${shapeClasses}`}
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {symbol}
      </div>
    );
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} markerStart={markerStart} style={style} />
      <EdgeLabelRenderer>
        <div className="nodrag nopan">
          <Badge x={sourceBadgePos.x} y={sourceBadgePos.y} symbol={sourceSymbol} />
          <Badge x={targetBadgePos.x} y={targetBadgePos.y} symbol={targetSymbol} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
