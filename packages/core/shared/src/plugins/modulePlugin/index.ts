/* eslint-disable no-case-declarations */
import { Socket } from 'rete/types'
import { WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

import { MagickComponent, MagickEngine } from '../../engine'
import { anySocket } from '../../sockets'
import {
  GraphData,
  IRunContextEditor,
  ModuleType,
  MagickNode,
  MagickWorkerOutputs,
  AsInputsData,
  AsOutputsData,
  WorkerData,
} from '../../types'
import { Module } from './module'
import { ModuleContext, ModuleManager } from './module-manager'
import { addIO, removeIO } from './utils'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment


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
interface IModuleComponent extends MagickComponent<MagickWorkerOutputs | Promise<MagickWorkerOutputs>> {
  updateModuleSockets: (UpdateModuleSockets) => void
  module: ModuleOptions
  noBuildUpdate: boolean
}

export type ModulePluginArgs = {
  engine: MagickEngine
  modules?: Record<string, ModuleType>
}

function install(
  runContext: ModuleIRunContextEditor, // | IRunContextEngine,
  { engine, modules = {} }: ModulePluginArgs
) {
  const moduleManager = new ModuleManager(modules)

  runContext.moduleManager = moduleManager

  moduleManager.setEngine(engine)

  runContext.on('componentregister', (component:IModuleComponent):void => {
    if (!component.module) return

    // socket - Rete.Socket instance or function that returns a socket instance
    // TODO: Check this assignment
    const socket = component.module.socket || anySocket
    const { nodeType, skip } = component.module
    const name = component.name

    switch (nodeType) {
      case 'input':
        const inputsWorker = component.worker

        moduleManager.registerInput(name, socket)

        if (skip) return

        component.worker = (
          node: WorkerData,
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
          return {}
        }
        break
      case 'triggerOut':
        const triggersWorker = component.worker

        moduleManager.registerTriggerOut(name, socket)

        if (skip) return

        component.worker = async (
          node: WorkerData,
          inputs: WorkerInputs,
          outputs: MagickWorkerOutputs,
          context
        ) => {
          let _outputs = outputs
          if (triggersWorker) {
            _outputs = await triggersWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            )
          }
          const ret = moduleManager.workerTriggerOuts.call(
            moduleManager,
            node,
            inputs,
            _outputs,
            context as { module: Module }
          )
          if(ret!==undefined) return ret
          else return {}
        }
        break
      case 'triggerIn':
        const triggerInWorker = component.worker

        moduleManager.registerTriggerIn(name, socket)

        if (skip) return

        component.worker = (
          node: WorkerData,
          inputs: WorkerInputs,
          outputs: MagickWorkerOutputs,
          context: any
        ) => {
          moduleManager.workerTriggerIns.call(
            moduleManager,
            node,
            inputs,
            outputs,
            context
          )
          if (triggerInWorker)
            return triggerInWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            )
          return {}
        }
        break
      case 'module':
        const builder = component.builder

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
            console.log('inputs are', inputs)
            const outputs = moduleManager.getOutputs(data)
            const triggerOuts = moduleManager.getTriggerOuts(data)
            console.log('triggerOuts', triggerOuts)
            const triggerIns = moduleManager.getTriggerIns(data)
            console.log('triggerIns', triggerIns)


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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
            if (!component.noBuildUpdate) component.updateModuleSockets(node)
            await builder.call(component, node)
          }
        }

        const moduleWorker = component.worker

        if (skip) return

        component.worker = async (
          node: WorkerData,
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

          if (moduleWorker) {
            return moduleWorker.call(component, node, inputs, outputs, {
              ...context,
              module,
            })
          }
          return {}
        }
        break
      case 'output':
        const outputsWorker = component.worker

        moduleManager.registerOutput(name, socket)

        if (skip) return

        component.worker = async (
          node: WorkerData,
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

          if (outputsWorker){
             return await outputsWorker.call(
              component,
              node,
              inputs,
              outputs,
              context
            )
          }
          return {}
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
