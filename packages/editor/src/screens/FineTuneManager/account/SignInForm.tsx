import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InfoCard from '../components/InfoCard'
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
      <Box component={'span'} sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" color="white">
          Fine Tune Manager
        </Typography>
      </Box>
      <InfoCard>
        <Box component={'span'} sx={{ textAlign: 'center' }}>
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
        </Box>

        <Box component={'span'} sx={{ textAlign: 'center' }}>
          <Promo />
          <Footer />
        </Box>
      </InfoCard>
    </section>
  )
}

function Promo() {
  return (
    <section>
      <ul className="mt-8 text-xl list-disc">
        <li>
          <b>Fine tune</b>completion models by uploading training and validation
          files
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
