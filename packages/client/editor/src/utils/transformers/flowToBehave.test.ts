// import {
//   getCoreRegistry,
//   GraphJSON,
//   writeNodeSpecsToJSON
// } from '@magickml/behave-graph';

// import rawFlowGraph from '../graphs/react-flow/graph.json';
// import { behaveToFlow } from './behaveToFlow.js';
// import { flowToBehave } from './flowToBehave.js';

// const flowGraph = rawFlowGraph as GraphJSON;

// const [nodes, edges] = behaveToFlow(flowGraph);

// it('transforms from flow to behave', () => {
//   const registry = getCoreRegistry();
//   const specJSON = writeNodeSpecsToJSON(registry);
//   const output = flowToBehave(nodes, edges, specJSON);
//   expect(output).toEqual(flowGraph);
// });
