import {
  FrigadeAnnouncement,
  FrigadeProvider as FrigadeProviderOG,
} from '@frigade/react'
import { FRIGADE_KEY } from 'clientConfig'
import { useSelector } from 'react-redux'

type Props = {
  children: React.ReactNode
}

const FrigadeProvider = ({ children }: Props) => {
  const globalConfig = useSelector((state: any) => state.globalConfig)

  // console.log("FRIGADE_KEY", FRIGADE_KEY)

  return (
    <FrigadeProviderOG
      publicApiKey={FRIGADE_KEY || ''}
      userId={globalConfig?.userId || 'anonymous'}
      config={{
        navigate: (url, target): void => {
          if (target === '_blank') {
            window.open(url, '_blank')
          } else {
            console.error('FrigadeProvider navigate', url, target)
          }
        },
        defaultAppearance: {
          theme: {
            colorText: 'white !important',
            colorTextSecondary: 'white',
            colorTextOnPrimaryBackground: '#fff',
            colorPrimary: '#1BC5EB',
            colorBackground: '#262b2e',
          },
          styleOverrides: {
            button: {
              border: 'none',
              outline: 'none',
            },
          },
        },
      }}
    >
      <FrigadeAnnouncement
        flowId="flow_8ZIGBYvK0fP6r4Fa"
        modalPosition="center"
      />
      {children}
    </FrigadeProviderOG>
  )
}

export default FrigadeProvider
