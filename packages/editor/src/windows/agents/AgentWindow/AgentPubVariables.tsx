// GENERATED 
import { Grid } from '@mui/material';
import styles from '../AgentWindowStyle.module.css';
import { Input, Switch } from '@magickml/client-core';

/**
 * Interface for AgentPubVariables Props
 */
interface Props {
  publicVars: any;
  setPublicVars: (data: any) => void;
}

/**
 * A functional component that lists and allows updates to public variables
 *
 * @param publicVars - object containing public variables
 * @param setPublicVars - a function for updating public variables
 * @returns JSX.Element
 */
const AgentPubVariables = ({ publicVars, setPublicVars }: Props) => {
  /**
   * Handle change events for the variables
   *
   * @param variable - the current variable
   * @param event - the event triggered by the input
   */
  const onChangeHandler = (variable, event) => {
    /**
     * Update the variable value with the event data
     *
     * @param inputValue - the current value of the variable
     * @param nativeEventData - the native event data from the event
     * @returns string - the updated variable value
     */
    function applyNativeEventToValue(inputValue, nativeEventData) {
      inputValue = inputValue || '';
      // if the native event is a backspace
      if (nativeEventData.inputType === 'deleteContentBackward') {
        // remove the last character
        inputValue =
          inputValue.length > 0 ? inputValue.slice(0, -1) : inputValue;
      }

      // otherwise, add the native event to the current variable value
      return inputValue + (nativeEventData.data ? nativeEventData.data : '');
    }

    const newVar = {
      ...variable,
      value:
        event.nativeEvent.data === null || event.nativeEvent.data
          ? // apply the native event to the current variable value
            applyNativeEventToValue(variable.value, event.nativeEvent)
          : event.target.checked,
    };

    setPublicVars({
      ...publicVars,
      [newVar.id]: newVar,
    });
  };

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
                    style={{ width: '100%' }}
                    value={variable.value}
                    type="text"
                    onChange={e => onChangeHandler(variable, e)}
                    name={variable.name}
                    placeHolder={'Add new value here'}
                  />
                )}
              </Grid>
            </Grid>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPubVariables;
