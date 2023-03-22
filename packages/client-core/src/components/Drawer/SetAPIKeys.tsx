import InfoDialog from '../InfoDialog'

const title = 'Important Notice: Set Your API Keys in the Editor Settings'
const body =
  'We want to make sure that your experience using Magick editor is as smooth as possible. To achieve this, we require all users to set their OpenAI API key in the editor settings. Not setting your API key may lead to issues with the editor.'

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
