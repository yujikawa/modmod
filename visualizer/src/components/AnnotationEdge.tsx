import {
  BaseEdge,
  getSimpleBezierPath,
  type EdgeProps,
} from 'reactflow';
import { useStore } from '../store/useStore';

export default function AnnotationEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { theme } = useStore();
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g pointerEvents="none">
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          strokeWidth: 1.5, 
          stroke: theme === 'dark' ? '#94a3b8' : '#64748b', 
          strokeDasharray: '4,4', 
          opacity: 0.5
        }} 
      />
    </g>
  );
}
