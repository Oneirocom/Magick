import { VariableJSON } from '@magickml/behave-graph';
import { Tab, useConfig, usePubSub } from '@magickml/providers';
import { Window } from 'client/core'
import { selectGraphJson, useGetSpellQuery, useSaveSpellMutation } from 'client/state';
import { v4 as uuidv4 } from 'uuid'
import { IDockviewPanelProps } from 'dockview';
import { useCallback, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Variable } from './Variable';
import { useSelector } from 'react-redux';

export const VariableWindow = (props: IDockviewPanelProps<{ tab: Tab, spellId: string }>) => {
  const { spellId, tab } = props.params
  const [newVariableName, setNewVariableName] = useState<string>('')
  const graphJson = useSelector(selectGraphJson(tab.id))
  const { data: spell } = useGetSpellQuery({ id: spellId })
  const { projectId } = useConfig()
  const [saveSpellMutation] = useSaveSpellMutation()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVariableName(e.target.value)
  }


  const saveVariable = useCallback((variable: VariableJSON) => {
    const graph = graphJson
    const variables = graph.variables.map((v) => v.id === variable.id ? variable : v);

    const newGraph = { ...graph, variables };
    const newSpell = { ...spell, graph: newGraph };

    return saveSpellMutation({ projectId, spell: newSpell })
      .then(() => enqueueSnackbar('Variable saved', { variant: 'success' }))
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Error saving variable', { variant: 'error' });
      });
  }, [spell, projectId, enqueueSnackbar, graphJson]);  // dependencies

  const deleteVariable = useCallback((variableId: string) => {
    const graph = graphJson
    const newGraph = { ...graph, variables: graph.variables.filter((v) => v.id !== variableId) };
    const newSpell = { ...spell, graph: newGraph };

    return saveSpellMutation({ projectId, spell: newSpell })
      .then(() => enqueueSnackbar('Variable deleted', { variant: 'success' }))
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Error deleting variable', { variant: 'error' });
      });
  }, [spell, projectId, enqueueSnackbar, graphJson]);  // dependencies

  const createNewVariable = useCallback(() => {
    const newVariable: VariableJSON = {
      name: newVariableName,
      id: uuidv4(),
      valueTypeName: 'string',
      initialValue: []
    };

    const graph = graphJson
    const newGraph = { ...graph, variables: [...graph.variables, newVariable] };
    const newSpell = { ...spell, graph: newGraph };

    return saveSpellMutation({ projectId, spell: newSpell })
      .then(() => {
        enqueueSnackbar('Variable created', { variant: 'success' });
        setNewVariableName('');  // Assuming this state is managed in this component
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Error creating variable', { variant: 'error' });
      });
  }, [spell, projectId, enqueueSnackbar, newVariableName, graphJson]);  // dependencies
  if (!spell) return null

  return (
    <Window borderless>
      <div>
        {spell.graph.variables.map((variable) => {
          return (
            <Variable variable={variable} updateVariable={saveVariable} deleteVariable={deleteVariable} />
          )
        })}
        <div className="flex flex-row px-2 mt-2">
          <input
            className="flex-grow"
            onChange={onInputChange}
            value={newVariableName}
            placeholder="New variable"
          />
          <button onClick={createNewVariable}>+</button>
        </div>
      </div >
    </Window >
  )
}