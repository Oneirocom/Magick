/* eslint-disable no-case-declarations */
import { Engine, Component, Socket } from 'rete/types'
import { InputsData, NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

import {
  GraphData,
  IRunContextEditor,
  ModuleType,
  MagickNode,
  MagickWorkerOutputs,
  AsInputsData,
  AsOutputsData,
} from '../../types'
import { MagickEngine } from '../../engine'
import { Module } from './module'
import { ModuleContext, ModuleManager } from './module-manager'
import { addIO, removeIO } from './utils'
import { ComponentBuilder } from 'rete/types/component'

//need to fix this interface.  For some reason doing the joing
interface IRunContextEngine extends Engine {
  moduleManager: ModuleManager
  on: any
  trigger: any
}

export interface ModuleIRunContextEditor extends IRunContextEditor {
  moduleManager: ModuleManager
}

type ModuleOptions = {
  socket: Socket
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  skip?: boolean
}

export type UpdateModuleSockets = (
  node: MagickNode,
  graphData?: GraphData,
  useSocketName?: boolean
) => () => void
interface IModuleComponent extends Component {
  updateModuleSockets: UpdateModuleSockets
  module: ModuleOptions
  noBuildUpdate: boolean
}

export type ModulePluginArgs = {
  engine: MagickEngine
  modules?: Record<string, ModuleType>
}

function install(
  runContext: IRunContextEngine | ModuleIRunContextEditor,
  { engine, modules = {} }: ModulePluginArgs
) {
  const moduleManager = new ModuleManager(modules)

  runContext.moduleManager = moduleManager

  moduleManager.setEngine(engine)

  runContext.on('componentregister', (component: IModuleComponent) => {
    if (!component.module) return

    // socket - Rete.Socket instance or function that returns a socket instance
    const { nodeType, socket, skip } = component.module
    const name = component.name

    switch (nodeType) {
      case 'input':
        const inputsWorker = component.worker

        moduleManager.registerInput(name, socket)

        if (skip) return

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: WorkerOutputs,
          context
        ) => {
          moduleManager.workerInputs.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context as { module: Module }
          )
          if (inputsWorker)
            return inputsWorker.call(component, node, inputs, outputs, context)
        }
        break
      case 'triggerOut':
        const triggersWorker = component.worker as any

        moduleManager.registerTriggerOut(name, socket)

        if (skip) return

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: MagickWorkerOutputs,
          context
        ) => {
          let _outputs = outputs
          if (triggersWorker) {
            _outputs = triggersWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            )
          }
          return moduleManager.workerTriggerOuts.call(
            moduleManager,
            node,
            inputs,
            _outputs,
            context as { module: Module }
          )
        }
        break
      case 'triggerIn':
        const triggerInWorker = component.worker

        moduleManager.registerTriggerIn(name, socket)

        if (skip) return

        component.worker = (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: MagickWorkerOutputs,
          context
        ) => {
          moduleManager.workerTriggerIns.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context as any
          )
          if (triggerInWorker)
            return triggerInWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            )
        }
        break
      case 'module':
        const builder: ComponentBuilder | undefined = component.builder

        if (builder) {
          component.updateModuleSockets = (
            node: MagickNode,
            graphData?: GraphData,
            useSocketName = false
          ) => {
            const modules = moduleManager.modules || []
            const currentNodeModule = node.data.spellId as string
            if (!modules[currentNodeModule] && !graphData) return

            if (!node.data.inputs) node.data.inputs = AsInputsData([])
            if (!node.data.outputs) node.data.outputs = AsOutputsData([])

            const data = modules[currentNodeModule]
              ? modules[currentNodeModule].data
              : graphData

            if (!data) return
            const inputs = moduleManager.getInputs(data)
            const outputs = moduleManager.getOutputs(data)
            const triggerOuts = moduleManager.getTriggerOuts(data)
            const triggerIns = moduleManager.getTriggerIns(data)

            // TODO OPTIMIZATION should find a way to cache these so we dont run over the whole add/remove IO sequence if we don't need to.
            removeIO(
              node,
              runContext as IRunContextEditor,
              [...inputs, ...triggerIns],
              [...outputs, ...triggerOuts]
            )

            try {
              // The arguments for this are getting bit crazy
              addIO({
                node,
                inputs,
                outputs,
                triggerOuts,
                triggerIns,
                useSocketName,
              })
            } catch (e) {
              return runContext.trigger('warn', e)
            }
          }

          component.builder = async node => {
            if (!component.noBuildUpdate) component.updateModuleSockets(node)
            await builder.call(component, node)
          }
        }

        const moduleWorker = component.worker

        if (skip) return

        component.worker = async (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: MagickWorkerOutputs,
          context: ModuleContext
        ) => {
          const module = await moduleManager.workerModule.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context
          )

          if (moduleWorker)
            return moduleWorker.call(component, node, inputs, outputs, {
              ...context,
              module,
            })
        }
        break
      case 'output':
        const outputsWorker = component.worker

        moduleManager.registerOutput(name, socket)

        if (skip) return

        component.worker = async (
          node: NodeData,
          inputs: WorkerInputs,
          outputs: MagickWorkerOutputs,
          context
        ) => {
          moduleManager.workerOutputs.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context as { module: Module }
          )

          if (outputsWorker)
            return await outputsWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            )
        }
        break
      default:
        break
    }
  })
}

const moduleExport = {
  name: 'Module Plugin',
  install,
}

export default moduleExport
