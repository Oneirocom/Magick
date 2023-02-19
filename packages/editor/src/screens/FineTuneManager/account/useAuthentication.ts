import { useContext } from 'react'
import { AccountContext } from './Account'

export default function useAuthentication() {
  return useContext(AccountContext)
}
