export default function UsageInstructions({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <details className="bg-white prose">
      <summary className="text-lg font-bold">Usage Instructions</summary>
      {children}
    </details>
  )
}
