import { getSessionId } from '../contexts/AuthProvider'
import { latitudeApiRootUrl } from '../config'

export const callExpire = async () => {
  const sessionId = await getSessionId()
  const endpoint = `${latitudeApiRootUrl}/user/expire`
  await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `session ${sessionId}`,
    },
  }).catch(err => {
    // throw new Error(err)
    // eslint-disable-next-line no-console
    console.log(err)
  })
}
