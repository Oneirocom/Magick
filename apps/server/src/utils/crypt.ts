import cryptojs from 'crypto-js'

const key = `${process.env.AES_KEY}`
const iv = `${process.env.AES_IV}`
const OLD_KEY = `,cf&Vzp3,QA9XJNPf0!X$%~tpw%meD_{vZwGJvWPN}E{4Dw^*qChQkEWt_TDyZ4`

export const encrypt = (str: string): string => {
  const enc = cryptojs.AES.encrypt(str, key, {
    iv: cryptojs.enc.Utf8.parse(iv),
  })
  const words = cryptojs.enc.Utf8.parse(`${enc}`)
  return cryptojs.enc.Base64.stringify(words)
}

export const decrypt = (str: string): string => {
  const b64 = cryptojs.enc.Base64.parse(str)
  const words = cryptojs.enc.Utf8.stringify(b64)
  try {
    const dec = cryptojs.AES.decrypt(words, key, {
      iv: cryptojs.enc.Utf8.parse(iv),
    })
    if (!dec || dec.toString(cryptojs.enc.Utf8) === '') {
      // Try the old key on error
      const dec2 = cryptojs.AES.decrypt(words, OLD_KEY, {
        iv: cryptojs.enc.Utf8.parse(iv),
      })
      return dec2.toString(cryptojs.enc.Utf8)
    }
    return dec.toString(cryptojs.enc.Utf8)
  } catch (error) {
    // Try the old key on error
    const dec = cryptojs.AES.decrypt(words, OLD_KEY, {
      iv: cryptojs.enc.Utf8.parse(iv),
    })
    return dec.toString(cryptojs.enc.Utf8)
  }
}
