import { Grid } from '@mui/material'
import styles from '../AgentWindowStyle.module.css'
import { Input, Switch } from '@magickml/client-core'

interface Props {
  publicVars: any
  setPublicVars: (data: any) => void
}

const AgentPubVariables = ({ publicVars, setPublicVars }: Props) => {
  const onChangeHandler = (variable, event) => {
    const input = event.target
    function applyNativeEventToValue(inputValue, nativeEventData) {
      inputValue = inputValue || ''

      // if input is selected to delete all
      if (input.selectionStart === 0 && input.selectionEnd === input.value.length) {
        // All text is selected, delete it
        inputValue = "";
      }

      // if the native event is a backspace
      if (nativeEventData.inputType === 'deleteContentBackward') {
        // remove the last character
        inputValue =
          inputValue.length > 0 ? inputValue.slice(0, -1) : inputValue
      }

      // otherwise, add the native event to the current variable value
      return inputValue + (nativeEventData.data ? nativeEventData.data : '')
    }

    const newVar = {
      ...variable,
      value:
        event.nativeEvent.data === null || event.nativeEvent.data
          ? // apply the native event to the current variable value
            applyNativeEventToValue(variable.value, event.nativeEvent)
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
                    onChange={e => onChangeHandler(variable, e)}
                  />
                ) : (
                  <Input
                    style={{ width: '100%', padding: '13px !important' }}
                    value={variable.value}
                    type="text"
                    onChange={e => onChangeHandler(variable, e)}
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
