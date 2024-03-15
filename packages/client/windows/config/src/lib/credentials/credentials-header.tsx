export const CredentialsHeader = () => {
  return (
    <div className="gap-y-1 pb-2 flex flex-col">
      <h3 className="font-semibold">Linked Secrets</h3>

      <p className="opacity-70">
        {`Link secrets (API keys, tokens, etc) to your Agent to use in your spells and connect to external services.`}
      </p>
    </div>
  )
}
