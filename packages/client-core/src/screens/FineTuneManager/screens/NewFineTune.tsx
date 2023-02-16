import LoginRequired from '../account/LoginRequired'
import NewFineTuneForm from '../fine-tunes/NewFineTuneForm'
import React from 'react'

export default function NewFineTunePage() {
  return (
    <LoginRequired>
      <NewFineTuneForm />
    </LoginRequired>
  )
}
