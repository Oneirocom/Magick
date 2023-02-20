import React from 'react'
import HomePage from '../screens/Home'
import useAuthentication from './useAuthentication'

export default function LoginRequired({
  children,
}: {
  children: React.ReactNode
}) {
  const { headers } = useAuthentication()
  return headers ? <>{children}</> : <HomePage />
}
