import type { INodeDefinition, 
    IAsyncNodeDefinition,
    IEventNodeDefinition,
    IFlowNodeDefinition,
    IFunctionNodeDefinition,
    IGraph,
    NodeType, INode, IFunctionNode, IEventNode, IFlowNode, IAsyncNode } from '@magickml/behave-graph';


export function defineNode(def: INodeDefinition): INodeDefinition {
  return def;
}

export function defineFunctionNode(def: IFunctionNodeDefinition): IFunctionNodeDefinition {
    return def;
    }


export function defineEventNode(def: IEventNodeDefinition): IEventNodeDefinition { return def; }

export function defineFlowNode(def: IFlowNodeDefinition): IFlowNodeDefinition { return def; }


export function defineAsyncNode(def: IAsyncNodeDefinition): IAsyncNodeDefinition { return def; }