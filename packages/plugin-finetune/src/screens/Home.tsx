import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SigninForm from '../account/SignInForm'
import useAuthentication from '../account/useAuthentication'

export default function HomePage() {
  const { isSignedIn } = useAuthentication()
  const navigate = useNavigate()
  useEffect(() => {
    if (isSignedIn) {
      console.log('isSignedIn', isSignedIn)
      navigate('/fineTuneManager/completions')
    }
  }, [isSignedIn])
  return (
    <>
      <div className="mx-auto max-w-6xl">
        <Header />
        <div className="flex flex-col lg:flex-row gap-x-20 gap-y-8 my-10">
          <div className="lg:my-20 lg:w-1/3 shrink-0">
            <SigninForm />
          </div>
        </div>
      </div>
    </>
  )
}

function Header() {
  return (
    <header className="my-4">
      <h1 className="flex flex-wrap gap-4 text-4xl lg:text-5xl">
        <span className="flex flex-nowrap gap-4 font-bold"></span>
      </h1>
    </header>
  )
}
