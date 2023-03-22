import InfoDialog from '../InfoDialog'

const title = 'Set Your API Keys'
const body =
  'Please set your API keys in the editor settings to use external APIs. You will need to do this before you can use any AI features'

export const SetAPIKeys = () => {
  return (
    <InfoDialog
      title={title}
      body={body}
      style={{
        width: '100%',
        height: '1px',
        marginLeft: '89%',
        marginTop: '-40%',
      }}
    />
  )
}
