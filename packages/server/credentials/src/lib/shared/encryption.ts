import crypto from 'crypto'
import { CREDENTIALS_ALGORITHM } from 'shared/config'

/**
 * Generates a key from a given secret key using SHA-256.
 * @param secretKey The secret key used for generating the hash.
 * @returns A buffer representing the hashed key.
 */
const getKey = (secretKey: string): Buffer => {
  return crypto.createHash('sha256').update(secretKey).digest()
}

/**
 * Encrypts a text using the specified secret key.
 * @param text The text to be encrypted.
 * @param secretKey The secret key used for encryption.
 * @returns The encrypted text as a hex string.
 */
export const encrypt = (text: string, secretKey: string): string => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    CREDENTIALS_ALGORITHM,
    getKey(secretKey),
    iv
  )
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

/**
 * Decrypts a given hash using the specified secret key.
 * @param hash The encrypted hash to be decrypted.
 * @param secretKey The secret key used for decryption.
 * @returns The decrypted text.
 */
export const decrypt = (hash: string, secretKey: string): string => {
  const [iv, encrypted] = hash.split(':').map(part => Buffer.from(part, 'hex'))
  const decipher = crypto.createDecipheriv(
    CREDENTIALS_ALGORITHM,
    getKey(secretKey),
    iv
  )
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ])

  return decrypted.toString().replace(/^"|"$/g, '')
}
