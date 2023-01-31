import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import requestHeaders from './requestHeaders'
import useAuthentication from './useAuthentication'

export default function SigninForm() {
  const navigate = useNavigate()
  const { signIn } = useAuthentication()
  const [isLoading, setIsLoading] = useState(false)
  const initialValue = { apiKey: '', organizationId: '' }
  const form = useForm({ defaultValues: initialValue })
  const [error, setError] = useState('')
  const [showOrgId, setShowOrgId] = useState(false)

  form.watch('apiKey')

  const onSubmit = form.handleSubmit(async function (
    formData: typeof initialValue
  ) {
    try {
      setIsLoading(true)

      const response = await fetch('https://api.openai.com/v1/engines', {
        headers: requestHeaders(formData),
      })
      if (response.ok) {
        signIn(formData.apiKey, formData.organizationId)
        navigate('/fineTuneManager/completions')
      } else {
        const { error } = await response.json()
        setError(error.message)
      }
    } catch (error) {
      toast.error(String(error))
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <section className="space-y-4">
      <h1 className="text-xl capitalize">Fine Tune Manager </h1>
      <hr />
      <form className="py-8 space-y-8" onSubmit={onSubmit}>
        {error && <div className="my-4 text-red-500">{error}</div>}
        <div>
          <input
            placeholder="Your OpenAI API Key"
            required
            type="text"
            width="100%"
            {...form.register('apiKey')}
          />
          <p>
            Your API key is{' '}
            <a
              href="https://beta.openai.com/account/api-keys"
              target="_blank"
              rel="noreferrer"
              tabIndex={-1}
            >
              available here.
            </a>
          </p>
        </div>
        <div>
          {showOrgId ? (
            <input
              placeholder="Organization ID"
              type="text"
              width="100%"
              {...form.register('organizationId')}
            />
          ) : (
            // <Link
            //   color="primary"
            //   onClick={event => {
            //     event.preventDefault()
            //     setShowOrgId(true)
            //   }}
            // >
            //   I have an organization ID
            // </Link>
            <></>
          )}
        </div>
        <div className="flex justify-end ">
          <Button
            disabled={form.getValues().apiKey === '' || isLoading}
            type="submit"
          >
            <span className="uppercase">{"Let's go"}</span>
          </Button>
        </div>
      </form>
    </section>
  )
}
