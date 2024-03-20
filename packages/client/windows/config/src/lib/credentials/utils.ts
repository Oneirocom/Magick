import { AgentCredential, Credential } from 'client/state'
import credentialsJson from 'packages/shared/nodeSpec/src/credentials.json'

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
  pluginName: string
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
  console.log('hasLinkedAgentCredential', name, credentials, agentCredentials)
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

// Function to find a matching AgentCredential for a given PluginCredential
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

// function that gets the available plugins based on the credentials.pluginName and returns an object array with the plugin name and the available credentials
// it takes in a credentials.json from the file
export function getAvailablePlugins(): { [key: string]: PluginCredential[] } {
  const json = credentialsJson as PluginCredential[]
  const availablePlugins: { [key: string]: PluginCredential[] } = {}
  json.forEach(cred => {
    if (!cred.available) return
    if (!availablePlugins[cred.pluginName]) {
      availablePlugins[cred.pluginName] = []
    }
    availablePlugins[cred.pluginName].push(cred)
  })
  return availablePlugins
}

// NEWER METHODS

export interface FindCredential {
  created_at: string
  updated_at: string
  agentId: string
  credentialId: string
  credentials: {
    name: string
    serviceType: string
    credentialType: string
    pluginName: string
    description?: string
  }
}

export interface FindCredentialIdParams {
  pluginName: string
  secretName: string
  arr: FindCredential[]
}

export interface FindCredentialIdReturn {
  credentialId?: string
  agentId?: string
  linked: boolean
}

export function findCredentialId({
  pluginName,
  secretName,
  arr,
}: FindCredentialIdParams): FindCredentialIdReturn {
  for (const obj of arr) {
    if (
      obj.credentials &&
      obj.credentials.pluginName === pluginName &&
      obj.credentials.name === secretName
    ) {
      return {
        credentialId: obj.credentialId,
        agentId: obj.agentId,
        linked: true,
      }
    }
  }
  return {
    linked: false,
  }
}

export function sortCredentials({
  pluginName,
  secretName,
  arr,
}: FindCredentialIdParams): FindCredential[] {
  return arr.filter(
    obj =>
      obj.credentials.pluginName === pluginName &&
      obj.credentials.name === secretName
  )
}
