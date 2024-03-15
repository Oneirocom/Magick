import { AgentCredential, Credential } from 'client/state'

export type PluginCredential = {
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  clientName?: string
  initials: string
  description?: string
  icon?: string
  helpLink?: string
  available: boolean
}

// Function to separate credentials into core+plugin and custom
export function separateCredentials(
  credentials: Credential[]
): [Credential[], Credential[]] {
  const corePluginCredentials = credentials.filter(
    c => c.credentialType === 'core' || c.credentialType === 'plugin'
  )
  const customCredentials = credentials.filter(
    c => c.credentialType === 'custom'
  )
  return [corePluginCredentials, customCredentials]
}

// Function to check if there is a linked AgentCredential for a given Credential name
export function hasLinkedAgentCredential(
  name: string,
  credentials?: Credential[],
  agentCredentials?: AgentCredential[]
): boolean {
  if (!credentials || !agentCredentials) return false
  const c = credentials.find(credential => credential.name === name)
  if (!c) return false
  return agentCredentials.some(ac => ac.credentialId === c?.id)
}

// Function to find credentials that match a given PluginCredential name
export function findMatchingCredentials(
  pluginCredential: PluginCredential,
  credentials?: Credential[]
): Credential[] {
  if (!credentials) return []
  return credentials.filter(
    credential => credential.name === pluginCredential.name
  )
}

export function findMatchingAgentCredential(
  pluginCredential: PluginCredential,
  credentials?: Credential[],
  agentCredentials?: AgentCredential[]
): AgentCredential | undefined {
  if (!credentials || !agentCredentials) return undefined
  const c = credentials.find(
    credential => credential.name === pluginCredential.name
  )
  if (!c) return undefined
  return agentCredentials.find(ac => ac.credentialId === c?.id)
}
