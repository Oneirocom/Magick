import { Grid } from '@mui/material'
import styles from './AgentWindowStyle.module.css'
import Switch from '../../components/Switch/Switch'
import Input from '../../components/Input/Input'

interface Props {
  publicVars: any
}

const AgentPubVariables = ({ publicVars }: Props) => {
  return (
    <div className={styles['agentPubVars']}>
      <h3>Public Variables</h3>
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
                  checked={variable?.data?._var}
                  onChange={() => {}}
                />
              ) : (
                <Input
                  style={{ width: '100%' }}
                  value={variable?.data?._var || variable?.data?.fewshot}
                  type="text"
                  onChange={() => {}}
                  disabled
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
