import { Grid } from '@mui/material'
import styles from '../AgentWindowStyle.module.css'
import { Switch, Input } from '@magickml/client-core'

interface Props {
  publicVars: any
  setPublicVars: (data: any) => void
}

const AgentPubVariables = ({ publicVars, setPublicVars }: Props) => {
  const agentPublicVars = publicVars.reduce((acc, obj) => {
    acc[obj.data?.name] = obj?.data?.fewshot || obj?.data?._var
    return acc
  }, {})

  const onChange = event => {
    const { name } = event.target;
    setPublicVars({
      ...publicVars,
      [name]:
        event.target.checked === undefined
          ? event.target.value
          : event.target.checked,
    })
  }

  return (
    <div className={styles['agentPubVars']}>
      <div className={styles['header']}>
        <h3>Public Variables</h3>
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
                  checked={publicVars[variable?.data?.name]}
                  onChange={onChange}
                  name={variable?.data?.name}
                />
              ) : (
                <Input
                  style={{ width: '100%' }}
                  value={publicVars[variable?.data?.name]}
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
