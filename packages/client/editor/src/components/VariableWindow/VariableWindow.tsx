import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { enqueueSnackbar } from 'notistack'
import { useReactFlow, ReactFlowInstance } from '@xyflow/react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

import {
  NodeJSON,
  Variable as VariableType,
  VariableJSON,
} from '@magickml/behave-graph'
import { Tab, useConfig } from '@magickml/providers'
import { Window } from 'client/core'
import {
  selectEngineRunning,
  selectGraphJson,
  setActiveInput,
  useGetSpellByNameQuery,
  useSaveSpellMutation,
} from 'client/state'
import { Button, Input } from '@magickml/client-ui'
import { IDockviewPanelProps } from 'dockview'
import { Variable } from './Variable'

interface Props
  extends IDockviewPanelProps<{
    tab: Tab
    spellId: string
    spellName: string
  }> {}

interface SortableItemProps {
  children: React.ReactNode
  id: string
}

function SortableItem({ children, id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    height: 'auto',
    minHeight: '38px',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export const VariableWindow: React.FC<Props> = props => {
  const { tab, spellName } = props.params
  const [variables, setVariables] = useState<VariableJSON[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [newVariableName, setNewVariableName] = useState<string>('')

  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: data => ({
        spell: data?.data?.data[0],
      }),
    }
  )

  const instance: ReactFlowInstance = useReactFlow()
  const graphJson = useSelector(selectGraphJson(tab.id))
  const { projectId } = useConfig()
  const [saveSpellMutation] = useSaveSpellMutation()
  const engineRunning = useSelector(selectEngineRunning)
  const dispatch = useDispatch()
  const readOnly = engineRunning

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (spell?.graph) {
      const persistedOrder = getPersistedVariablesOrder()
      const orderedVariables = persistedOrder
        ? persistedOrder
        : spell.graph.variables
      setVariables([...orderedVariables])
    }
  }, [spell])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVariableName(e.target.value)
  }

  const persistVariablesOrder = (variables: VariableJSON[]): void => {
    localStorage.setItem(
      `${spell.id}:variablesOrder`,
      JSON.stringify(variables)
    )
  }

  const getPersistedVariablesOrder = (): VariableJSON[] | null => {
    const order = localStorage.getItem(`${spell.id}:variablesOrder`)
    return order ? JSON.parse(order) : null
  }

  const deleteAllVariableNodes = useCallback(
    (variable: VariableJSON) => {
      const regex = new RegExp(`variables/(set|get|on)/${variable.name}`)
      const nodes = instance.getNodes()
      const edges = instance.getEdges()

      const newNodes = nodes.filter(node => node.type && !regex.test(node.type))
      const removedNodes = nodes
        .filter(node => node.type && regex.test(node.type))
        .map(node => node.id)
      const newEdges = edges.filter(
        edge =>
          !removedNodes.includes(edge.source) &&
          !removedNodes.includes(edge.target)
      )

      instance.setNodes(newNodes)
      instance.setEdges(newEdges)
    },
    [instance]
  )

  const saveVariable = useCallback(
    (variable: VariableJSON) => {
      if (!spell || !spell.graph) {
        return Promise.reject(new Error('Spell or graph is undefined'))
      }
      const graph = spell.graph
      const updatedVariables = graph.variables.map((v: VariableType) =>
        v.id === variable.id ? variable : v
      )

      const newGraph = { ...graph, variables: updatedVariables }
      const newSpell = { ...spell, graph: newGraph }

      return saveSpellMutation({ projectId, spell: newSpell })
        .unwrap()
        .then(() => {
          enqueueSnackbar('Variable saved', { variant: 'success' })
          setVariables(updatedVariables)
          persistVariablesOrder(updatedVariables)
        })
        .catch(err => {
          console.error(err)
          enqueueSnackbar('Error saving variable', { variant: 'error' })
        })
    },
    [spell, projectId, saveSpellMutation, enqueueSnackbar, graphJson]
  )

  const deleteVariable = useCallback(
    (variableId: string) => {
      if (!spell || !spell.graph) {
        return Promise.reject(new Error('Spell or graph is undefined'))
      }
      const graph = spell.graph
      const variable = graph.variables.find(
        (v: VariableType) => v.id === variableId
      )
      if (!variable) {
        return Promise.reject(new Error('Variable not found'))
      }
      const newVariables = graph.variables.filter(
        (v: VariableType) => v.id !== variableId
      )
      const newGraph = {
        ...graph,
        variables: newVariables,
        nodes: graph.nodes.filter(
          (node: NodeJSON) => !node.type.includes(variable.name)
        ),
      }

      const newSpell = { ...spell, graph: newGraph }

      deleteAllVariableNodes(variable)

      return saveSpellMutation({ projectId, spell: newSpell })
        .unwrap()
        .then(() => {
          enqueueSnackbar('Variable deleted', { variant: 'success' })
          setVariables(newVariables)
          persistVariablesOrder(newVariables)
        })
        .catch(err => {
          console.error(err)
          enqueueSnackbar('Error deleting variable', { variant: 'error' })
        })
    },
    [
      spell,
      projectId,
      saveSpellMutation,
      enqueueSnackbar,
      deleteAllVariableNodes,
      graphJson,
    ]
  )

  const createNewVariable = useCallback(() => {
    if (!spell || !spell.graph) {
      return Promise.reject(new Error('Spell or graph is undefined'))
    }
    const newVariable: VariableJSON = {
      name: newVariableName,
      id: uuidv4(),
      valueTypeName: 'string',
      initialValue: '',
    }

    const graph = spell.graph
    const newVariables = [newVariable, ...graph.variables]
    const newGraph = { ...graph, variables: newVariables }
    const newSpell = { ...spell, graph: newGraph }

    return saveSpellMutation({ projectId, spell: newSpell })
      .unwrap()
      .then(() => {
        enqueueSnackbar('Variable created', { variant: 'success' })
        setNewVariableName('')
        setVariables(newVariables)
        persistVariablesOrder(newVariables)
      })
      .catch(err => {
        console.error(err)
        enqueueSnackbar('Error creating variable', { variant: 'error' })
      })
  }, [
    spell,
    projectId,
    saveSpellMutation,
    enqueueSnackbar,
    newVariableName,
    graphJson,
  ])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id.toString())
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      setVariables(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        persistVariablesOrder(newOrder)

        // Update the spell with the new order
        if (spell && spell.graph) {
          const newGraph = { ...spell.graph, variables: newOrder }
          const newSpell = { ...spell, graph: newGraph }
          saveSpellMutation({ projectId, spell: newSpell })
            .unwrap()
            .catch(err => {
              console.error(err)
              enqueueSnackbar('Error updating variable order', {
                variant: 'error',
              })
            })
        }

        return newOrder
      })
    }
  }

  if (!spell?.graph) return null

  return (
    <Window borderless>
      <div
        className="relative h-full  flex flex-col"
        onClick={() => dispatch(setActiveInput(null))}
      >
        {readOnly ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#363d42]">
            <div className="text-white text-lg">Read-Only Mode</div>
            <div className="text-white text-md mt-2">
              Run your spell to modify your Agent
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center px-2 mt-2 gap-2 border-b-2 border-b-solid border-b-[var(--background-color)] pb-2 justify-center h-10">
              <Input
                className={`focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent h-full ${
                  readOnly ? 'opacity-50 pointer-events-none' : ''
                }`}
                onChange={onInputChange}
                value={newVariableName}
                placeholder="New variable"
              />
              <Button
                className={`h-full w-8 border border-[var(--dark-3)] bg-ds-neutral rounded-sm ${
                  readOnly ? 'opacity-50 pointer-events-none' : ''
                }`}
                variant="secondary"
                onClick={createNewVariable}
              >
                +
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <SortableContext
                items={variables}
                strategy={verticalListSortingStrategy}
              >
                <div className="variable-list overflow-y-auto">
                  {variables.map(variable => (
                    <SortableItem key={variable.id} id={variable.id}>
                      <div className="variable-item border-black border-b-none bg-gray-800">
                        <Variable
                          key={variable.id}
                          variable={variable}
                          deleteAllVariableNodes={() => {
                            deleteAllVariableNodes(variable)
                          }}
                          updateVariable={saveVariable}
                          deleteVariable={deleteVariable}
                        />
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <div className="variable-item bg-gray-800">
                    <Variable
                      variable={
                        variables.find(v => v.id === activeId) as VariableJSON
                      }
                      deleteAllVariableNodes={() => {}}
                      updateVariable={() => Promise.resolve()}
                      deleteVariable={() => Promise.resolve()}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>
    </Window>
  )
}
