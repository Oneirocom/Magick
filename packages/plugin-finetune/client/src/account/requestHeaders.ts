// DOCUMENTED 
/**
 * Generates the request headers object for a given API request, based on the provided apiKey
 * and organizationId values.
 * 
 * @param apiKey A string representing the authentication key, or null if not provided.
 * @param organizationId A string representing the organization id, or null if not provided.
 * @returns An object containing the request header values for the provided apiKey and organizationId.
 */
export default function requestHeaders({
  apiKey,
  organizationId,
}: {
  apiKey: string | null;
  organizationId: string | null;
}): {[key: string]: string} {
  // Initialize empty headers object.
  const headers: {[key: string]: string} = {};
  // If apiKey is provided, add Authorization header.
  if(apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  // If organizationId is provided, add OpenAI-Organization header.
  if(organizationId) headers['OpenAI-Organization'] = organizationId;

  return headers;
}