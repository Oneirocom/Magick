import { FC } from 'react'

export const EthereumComponent: FC<any> = (props) => {
  props = props.props

  return (
    <div style={{ padding: '50px', fontSize: '12px' }}>
      <h1>Ethereum Plugin</h1>
      <span>this is /ethereum page</span>
    </div>
  )
}
