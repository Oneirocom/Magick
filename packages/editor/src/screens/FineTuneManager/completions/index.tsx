import LoginRequired from '../account/LoginRequired'
import CompletionList from './CompletionList'
import React from 'react'

export default function CompletionsPage() {
  return (
    <LoginRequired>
      <CompletionList />
    </LoginRequired>
  )
}
