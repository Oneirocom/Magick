import { Grid } from '@mui/material'
import styles from './AgentWindowStyle.module.css'
import Switch from '../../components/Switch/Switch'
import Input from '../../components/Input/Input'
import { useState } from 'react'
import Button from '../../components/Button'

interface Props {
  publicVars: any
  update: ({}) => void
}

const AgentPubVariables = ({ publicVars, update }: Props) => {
  const agentPublicVars = publicVars.reduce((acc, obj) => {
    acc[obj.data?.name] = obj?.data?.fewshot || obj?.data?._var
    return acc
  }, {})
  const [agentPublicInputsState, setAgentPublicInputs] =
    useState(agentPublicVars)

  const onChange = event => {
    const { name } = event.target
    setAgentPublicInputs({
      ...agentPublicInputsState,
      [name]:
        event.target.checked === undefined
          ? event.target.value
          : event.target.checked,
    })
  }

  const onSave = () => {
    const _data = {
      data: {
        agentPublicInputs: JSON.stringify(agentPublicInputsState),
      },
    }
    update(_data)
  }

  return (
    <div className={styles['agentPubVars']}>
      <div className={styles['header']}>
        <h3>Public Variables</h3>
        <Button onClick={onSave} className={styles['btn']}>
          SAVE
        </Button>
      </div>
      {publicVars.map(variable => {
        return (
          <Grid
            container
            key={variable?.id}
            style={{ alignItems: 'center', marginBottom: '10px' }}
          >
            <Grid item>
              <p style={{ marginRight: '20px' }}>
                {`${variable?.data?.name}: `}
              </p>
            </Grid>
            <Grid item xs={8}>
              {variable.name.includes('Boolean') ? (
                <Switch
                  label={''}
                  checked={agentPublicInputsState[variable?.data?.name]}
                  onChange={onChange}
                  name={variable?.data?.name}
                />
              ) : (
                <Input
                  style={{ width: '100%' }}
                  value={agentPublicInputsState[variable?.data?.name]}
                  type="text"
                  onChange={onChange}
                  name={variable?.data?.name}
                  multiline
                />
              )}
            </Grid>
          </Grid>
        )
      })}
    </div>
  )
}

export default AgentPubVariables
