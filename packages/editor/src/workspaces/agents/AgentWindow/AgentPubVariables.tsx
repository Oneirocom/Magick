import { Grid } from '@mui/material'
import styles from '../AgentWindowStyle.module.css'
import { Switch, Input } from '@magickml/client-core'

interface Props {
  publicVars: any
  setPublicVars: (data: any) => void
}

const AgentPubVariables = ({ publicVars, setPublicVars }: Props) => {
  const onChange = (variable, event) => {
    const newVar = {
      ...variable,
      value:
        event.target.checked === undefined
          ? event.target.value
          : event.target.checked,
    }

    setPublicVars({
      ...publicVars,
      [newVar.id]: newVar,
    })
  }

  return (
    <div className={styles['agentPubVars']}>
      <div className={styles['header']}>
        <h3>Public Variables</h3>
      </div>
      <div
        style={{
          maxHeight: '150px',
          overflow: 'auto',
          marginBottom: '10px',
        }}
      >
        {Object.values(publicVars).map((variable: any) => {
          console.log('variable is', variable)
          return (
            <Grid
              container
              key={variable.id}
              style={{
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Grid item>
                <p style={{ marginRight: '20px' }}>{`${variable.name}: `}</p>
              </Grid>
              <Grid item xs={8}>
                {variable?.type?.includes('Boolean') ? (
                  <Switch
                    label={''}
                    checked={variable.value}
                    onChange={e => onChange(variable, e)}
                    name={variable.name}
                  />
                ) : (
                  <Input
                    style={{ width: '100%' }}
                    value={variable.value}
                    type="text"
                    onChange={e => onChange(variable, e)}
                    name={variable.name}
                    placeHolder={'Add new value here'}
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
