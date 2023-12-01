import { GraphJSON } from '@magickml/behave-graph';

export const hasPositionMetaData = (graph: GraphJSON): boolean => {
  if (graph.nodes === undefined) return false;
  return graph.nodes.some(
    (node) =>
      node.metadata?.positionX !== undefined ||
      node.metadata?.positionY !== undefined
  );
};
