// DOCUMENTED 
/**
 * This file exports several modules that provide functions and classes for various parts of the application.
 * Please see individual modules for detailed documentation on their usage.
 */

// Export classes and functions related to agents
export * from './agents/Agent';
export * from './agents/AgentManager';

// Export all API related modules
export * from './api/apis';
export * from './api';

// Export the main app module
export * from './app';

// Export functions for building the magick interface
export * from './helpers/buildMagickInterface';

// Configuration-related exports
export * from './config/configuration';
export * from './config/types';
export * from './config/validators';

// Declaration of types
export * from './declarations';

// Export file server
export * from './servers/fileServer';

// Export google text-to-speech and speech-to-text servers
export * from './servers/googleSpeechToText';
export * from './servers/googleTextToSpeech';

// Export hooks
export * from './hooks';

// Export logger utility
export * from './utils/logger';

// Export the database client
export * from './dbClient';

// Export the custom server error class
export * from './utils/ServerError';

// Export service modules
export * from './services';

// Export socket related modules
export * from './sockets/sockets';

//Export the tiktalknet server
export * from './servers/tiktalknet';

// Export general utility modules
export * from './utils';

//Export the spell checker helper
export * from './helpers/getSpell';