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
    <main className="mx-auto mb-8 space-y-8 max-w-2xl">
      <h1 className="text-3xl">
        <span className="font-normal">{name}</span> {id}
      </h1>
      {error && <ErrorMessage error={error} />}
      {children}
    </main>
  )
}
