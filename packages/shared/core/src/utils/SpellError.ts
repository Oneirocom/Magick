// DOCUMENTED
/**
 *  The possible custom error codes to be used in the application.
 */
export type CustomErrorCodes =
  | 'input-failed'
  | 'server-error'
  | 'not-found'
  | 'already-exists'
  | 'authentication-error'

/**
 * A class used to represent a server error. Extends the built-in Error object
 * @class
 */
export class SpellError extends Error {
  /** The code of the custom error */
  public code: CustomErrorCodes
  /** The HTTP status code of the error */
  public status: number
  /** The error message */
  public override message: string
  /** Additional details about the error */
  public details?: string

  /**
   * @constructor
   * @param {CustomErrorCodes} code the code of the custom error
   * @param {string} message the error message
   * @param {string} [details] additional details about the error (optional)
   */
  public constructor(
    code: CustomErrorCodes,
    message: string,
    details?: string
  ) {
    super()
    this.code = code
    this.message = message
    this.details = details
    this.status = mapStatusCode(code)
  }
}

/**
 * Maps the custom error code to its corresponding HTTP status code.
 * @function
 * @param {CustomErrorCodes} customErrorCode The code of the custom error
 * @returns The corresponding HTTP status code
 */
export const mapStatusCode = (customErrorCode: CustomErrorCodes) => {
  switch (customErrorCode) {
    case 'input-failed':
      return 400
    case 'authentication-error':
      return 401
    case 'already-exists':
      return 239
    case 'not-found':
      return 404
    case 'server-error':
      return 500
    default:
      return 500
  }
}
