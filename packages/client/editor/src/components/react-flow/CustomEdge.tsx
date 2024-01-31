import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
} from 'reactflow';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge id={id} path={path} />
  );
}