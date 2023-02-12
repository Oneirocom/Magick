import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SigninForm from '../account/SignInForm'
import useAuthentication from '../account/useAuthentication'

export default function HomePage() {
  const { isSignedIn } = useAuthentication()
  const navigate = useNavigate()
  useEffect(() => {
    if (isSignedIn) {
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
          <div className="lg:w-2/3">
            <Promo />
          </div>
        </div>
        <Footer />
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

function Promo() {
  return (
    <section>
      <ul className="mt-8 text-xl list-disc">
        <li>
          <b>Fine tune</b> your completion model by uploading training and
          validation files
        </li>
        <li>
          Upload <b>classification</b> and <b>search</b> files
        </li>
        <li>CSV, Excel spreadsheets, and of course JSONL</li>
        <li>Play around and see the API requests</li>
      </ul>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <p>
        For usage limits, terms and conditions, billing and charges, etc check
        your OpenAI account. Use responsibly.
      </p>
    </footer>
  )
}
