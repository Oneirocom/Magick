// DOCUMENTED
/**
 * This file exports several modules that provide functions and classes for various parts of the application.
 * Please see individual modules for detailed documentation on their usage.
 */

// Export all API related modules
export * from './api/apis'
export * from './api'

// Export the main app module
export * from './app'

// Configuration-related exports
export * from './config/configuration'
export * from './config/types'
export * from './config/validators'

// Declaration of types
export * from './declarations'

// Export file server
export * from './servers/fileServer'

// Export google text-to-speech and speech-to-text servers
export * from './servers/googleSpeechToText'
export * from './servers/googleTextToSpeech'

// Export hooks
export * from './hooks'

// Export the database client
export * from './dbClient'

// Export service modules
export * from './services'

// Export socket related modules
export * from './sockets/sockets'

//Export the tiktalknet server
export * from './servers/tiktalknet'

// Export metering functions
export * from './metering'
// tools for intrasystem communication
export * from './communication'

export * from './lib/feathersPermissions'
export * from './types'
