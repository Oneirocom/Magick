import crypto from 'crypto'
import { CREDENTIALS_ALGORITHM } from 'shared/config'

const getKey = (secretKey: string): Buffer => {
  return crypto.createHash('sha256').update(secretKey).digest()
}

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
