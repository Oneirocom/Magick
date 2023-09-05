import { useEffect, useState } from 'react'
import { LipSync } from '../utils/lip.sync'

export const useLipSync = avatarVrm => {
  const [lipSync, setLipSync] = useState<any>(null)

  useEffect(() => {
    if (!avatarVrm) {
      return
    }
    const newLipSync = new LipSync(avatarVrm)
    setLipSync(newLipSync)
  }, [avatarVrm])

  return lipSync
}
