// DOCUMENTED
import { Grid } from '@mui/material'
import styles from '../AgentWindowStyle.module.css'
import { Input, Switch } from '@magickml/client-core'
import { useEffect, useState } from 'react'
import { NodeDataWithType } from './utils'

/**
 * Interface for Props.
 */
interface Props {
  publicVars: any
  selectedAgent: any
  setPublicVars: (data: any) => void
  update: (id: string, data?: any) => void
}

/**
 * Agent public variables component.
 * @param publicVars - public variables data
 * @param setPublicVars - function to set public variables
 */
const AgentPubVariables = ({
  publicVars,
  setPublicVars,
  update, selectedAgent
}: Props) => {
  const [publicVariables, setPublicVariables] = useState<NodeDataWithType[]>([]);

  useEffect(() => {
    if (publicVars)
      setPublicVariables(publicVars);
  }, [setPublicVariables, publicVars]);

  const updatePubVariables = async (
    event:
      | React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await update(selectedAgent.id);
    }
  };

  const handleInputChange = async (
    index: number,
    type: string,
    value?: any
  ) => {
    const newVariables = [...publicVariables];
    if (type === 'text' || type === 'string') {
      newVariables[index].stringValue = value;
    } else {
      newVariables[index]._var = !newVariables[index]._var;
      newVariables[index].boolValue = !newVariables[index].boolValue;
      await update(selectedAgent.id, { ...selectedAgent, publicVariables: JSON.stringify(newVariables) })
    }
    setPublicVariables(newVariables);
    setPublicVars(newVariables);
  };

  return (
    <div className={styles.agentPubVars}>
      <div className={styles.header}>
        <h3>Public Variables</h3>
      </div>
      <div
        style={{
          maxHeight: '150px',
          overflow: 'auto',
          marginBottom: '10px',
        }}
      >
        {publicVariables.map((variable, index) => {
          return (
            <Grid
              container
              key={variable.name + index}
              style={{
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Grid item xs={2}>
                <p style={{ wordBreak: "break-all", whiteSpace: "normal", marginRight: '2px' }}>{`${variable.name}: `}</p>
              </Grid>
              <Grid item xs={8}>
                {variable.type === 'boolean' ? (
                  <Switch
                    label={''}
                    checked={variable.boolValue}
                    onChange={() => handleInputChange(index, 'bool')}
                  />
                ) : (
                  <Input
                    style={{ width: '100%', padding: '13px !important' }}
                    value={variable.stringValue}
                    type="text"
                    onKeyDown={(e) => updatePubVariables(e)}
                    onChange={e => {
                      handleInputChange(index, 'text', e.target.value)
                    }}
                    name={variable.name}
                    placeHolder={'Add new value here'}
                    multiline={true}
                  />
                )}
              </Grid>
            </Grid>
          )
        })}
      </div>
    </div>
  )
}

export default AgentPubVariables
