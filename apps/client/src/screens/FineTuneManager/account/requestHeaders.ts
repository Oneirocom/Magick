export default function requestHeaders({
  apiKey,
  organizationId,
}: {
  apiKey: string | null
  organizationId: string | null
}) {
  return {
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined),
    ...(organizationId ? { 'OpenAI-Organization': organizationId } : undefined),
  }
}
