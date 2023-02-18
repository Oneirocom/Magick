import { Box, Typography } from '@mui/material'
import React from 'react'
import ErrorMessage from './ErrorMessage'

export default function DetailsPage({
  id,
  name,
  error,
  children,
}: {
  id: string
  name: string
  error?: Error
  children: React.ReactNode
}) {
  return (
    <main>
      {/* TODO @thomageanderson: remove hardcoded color when global mui themes are supported */}
      <Box component={'span'} sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" color="white">
          {name} {id}
        </Typography>
      </Box>
      {error && <ErrorMessage error={error} />}
      {children}
    </main>
  )
}
