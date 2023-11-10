import { Edge, Node } from 'reactflow';

export const autoLayout = (nodes: Node[], edges: Edge[]) => {
  let x = 0;
  nodes.forEach((node) => {
    node.position.x = x;
    x += 200;
  });
};
