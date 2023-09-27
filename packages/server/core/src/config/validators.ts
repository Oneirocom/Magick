// DOCUMENTED
/**
 * This file provides a validation library for FeathersJS.
 * For more information about this file, visit the link https://dove.feathersjs.com/guides/cli/validators.html
 */

import { Ajv, addFormats, FormatsPluginOptions } from '@feathersjs/schema'

const formats: FormatsPluginOptions = [
  // List of supported JSON schema formats
  'date-time', // Format for a date-time value as defined by RFC 3339.
  'time', // Format for a time value as defined by RFC 3339.
  'date', // Format for a date value as defined by RFC 3339.
  'email', // A string that contains a valid email address.
  'hostname', // A string that contains a valid hostname, IPv4 address, or IPv6.
  'ipv4', // A string that contains a valid IPv4 address.
  'ipv6', // A string that contains a valid IPv6 address.
  'uri', // A valid URI, according to RFC3986.
  'uri-reference', // A string that contains a valid URI or a valid relative reference.
  'uuid', // Format for a UUID value.
  'uri-template', // A string that contains a valid URI Template according to RFC6570.
  'json-pointer', // A string that contains a valid JSON Pointer according to RFC6901.
  'relative-json-pointer', // A string that contains a valid relative JSON Pointer according to draft 6 of the JSON Schema specification.
  'regex', // A valid Regular Expression.
]

/**
 * Adds the supported JSON schema formats to the ajv instance for validating request data.
 * @param ajv - The instance of ajv library to add formats to.
 * @returns An ajv instance with the added formats.
 */
export const dataValidator: Ajv = addFormats(new Ajv({}), formats)

/**
 * Adds the supported JSON schema formats to the ajv instance for validating query parameters.
 * @param ajv - The instance of ajv library to add formats to.
 * @returns An ajv instance with the added formats.
 */
export const queryValidator: Ajv = addFormats(
  new Ajv({
    coerceTypes: true, // Convert query parameter strings to numbers, etc. if possible.
    removeAdditional: true, // Remove properties not in schema from validated data.
  }),
  formats
)
