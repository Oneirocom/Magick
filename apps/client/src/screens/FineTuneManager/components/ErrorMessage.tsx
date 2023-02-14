export default function ErrorMessage({
  error,
}: {
  error: Error | string
}): JSX.Element {
  return (
    <div className="relative py-3 px-4 my-4 mx-auto max-w-2xl text-red-600 bg-red-100 rounded border border-red-600">
      <strong className="font-bold">Oops!</strong>
      <span className="block sm:inline"> {String(error)}</span>
    </div>
  )
}
