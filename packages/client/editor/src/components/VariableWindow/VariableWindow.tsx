import { VariableJSON } from '@magickml/behave-graph';
import { Tab, useConfig, usePubSub } from '@magickml/providers';
import { Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@magickml/ui';
import { Window } from 'client/core'
import { useGetSpellQuery, useSaveSpellMutation } from 'client/state';
import { v4 as uuidv4 } from 'uuid'
import { IDockviewPanelProps } from 'dockview';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { VariableControl } from '../PropertiesWindow/VariableForm';
import { Variable } from './Variable';

export const VariableWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  const { tab, spellId } = props.params
  const [newVariableName, setNewVariableName] = useState<string>('')
  const { data: spell } = useGetSpellQuery({ id: spellId })
  const { projectId } = useConfig()
  const [saveSpellMutation] = useSaveSpellMutation()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVariableName(e.target.value)
  }

  const saveVariable = (variable: VariableJSON) => {
    const graph = spell.graph

    const newGraph = {
      ...graph,
      variables: [
        ...graph.variables.filter((v) => v.id !== variable.id),
        variable,
      ],
    }

    const newSpell = {
      ...spell,
      graph: newGraph,
    }

    return saveSpellMutation({
      projectId,
      spell: newSpell
    })
      .then(() => {
        enqueueSnackbar('Variable saved', {
          variant: 'success',
        })
      })
      .catch((err) => {
        console.error(err)
        enqueueSnackbar('Error saving variable', {
          variant: 'error',
        })
      })
  }

  const deleteVariable = (variableId: string) => {
    const graph = spell.graph

    const newGraph = {
      ...graph,
      variables: [
        ...graph.variables.filter((v) => v.id !== variableId),
      ],
    }

    const newSpell = {
      ...spell,
      graph: newGraph,
    }

    return saveSpellMutation({
      projectId,
      spell: newSpell
    })
      .then(() => {
        enqueueSnackbar('Variable saved', {
          variant: 'success',
        })
      })
      .catch((err) => {
        console.error(err)
        enqueueSnackbar('Error saving variable', {
          variant: 'error',
        })
      })
  }

  const createNewVariable = () => {
    const newVariable: VariableJSON = {
      name: newVariableName,
      id: uuidv4(),
      valueTypeName: 'string',
      initialValue: []
    }

    saveVariable(newVariable)
      .then(() => {
        setNewVariableName('')
      })
  }

  if (!spell) return null

  const tabsTriggerClassname = "w-full text-center border-b-2 border-b-solid border-b-[var(--background-color)]"

  return (
    <Window borderless>
      <div>
        {spell.graph.variables.map((variable) => {
          return (
            <Variable variable={variable} updateVariable={saveVariable} deleteVariable={deleteVariable} />
          )
        })}
        <div className="flex flex-row px-2 mt-2">
          <Input onChange={onInputChange} value={newVariableName} placeholder="New variable" />
          <Button size="icon" onClick={createNewVariable}>+</Button>
        </div>
      </div >
    </Window >
  )
}