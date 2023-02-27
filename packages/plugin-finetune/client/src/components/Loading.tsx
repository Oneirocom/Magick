import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

export default function Loading() {
  return (
    <div className="flex flex-row justify-around my-20">
      <CircularProgress size="xlarge" />
    </div>
  )
}
