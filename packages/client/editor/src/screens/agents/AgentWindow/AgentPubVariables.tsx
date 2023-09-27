// DOCUMENTED
import { Grid } from '@mui/material'
import styles from '../AgentWindowStyle.module.css'
import { Input, Switch } from 'client/core'

/**
 * Interface for Props.
 */
interface Props {
  publicVars: any
  setPublicVars: (data: any) => void
  setUpdateNeeded: (data: boolean) => void
}

/**
 * Agent public variables component.
 * @param publicVars - public variables data
 * @param setPublicVars - function to set public variables
 */
const AgentPubVariables = ({
  publicVars,
  setPublicVars,
  setUpdateNeeded,
}: Props) => {
  /**
   * Handle changes to public variables.
   * @param variable - variable object
   * @param event - DOM event
   */

  const onChangeHandler = (variable, event) => {
    // Update the public variables data
    setPublicVars({
      ...publicVars,
      [variable.id]: {
        ...variable,
        value:
          event.target.checked === undefined
            ? event.target.value
            : event.target.checked,
      },
    })
    setUpdateNeeded(true)
  }

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
        {Object.values(publicVars).map((variable: any) => {
          return (
            <Grid
              container
              key={variable.id}
              style={{
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Grid item xs={1}>
                <p
                  style={{
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    marginRight: '2px',
                  }}
                >{`${variable.name}: `}</p>
              </Grid>
              <Grid item xs={8}>
                {variable?.type?.includes('Boolean') ? (
                  <Switch
                    label={''}
                    checked={variable.value}
                    onChange={e => {
                      onChangeHandler(variable, e)
                    }}
                  />
                ) : (
                  <Input
                    style={{ width: '100%', padding: '13px !important' }}
                    value={variable.value}
                    type="text"
                    onChange={e => {
                      onChangeHandler(variable, e)
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
