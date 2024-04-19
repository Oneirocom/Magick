import { PortalSubscriptions } from '@magickml/portal-utils-shared'
import { useConfig } from '@magickml/providers'
import { useGetUserQuery } from 'client/state'
import { useEffect, useState } from 'react'
import { Roles } from '@magickml/portal-config'
import posthog from 'posthog-js'

const flags = {
  SERAPH_CHAT_WINDOW: process.env.NEXT_PUBLIC_FEATURE_SERAPH_CHAT_WINDOW,
}

export enum Features {
  SERAPH_CHAT_WINDOW = 'SERAPH_CHAT_WINDOW',
}

const featureList: Record<Features, (PortalSubscriptions | Roles | boolean)[]> =
  {
    [Features.SERAPH_CHAT_WINDOW]: [Roles.ADMIN],
    // [Features.SERAPH_CHAT_WINDOW]: [WIZARD, APPRENTICE, NEOPHYTE, ADMIN],
  }
export const useFeatureFlag = (feature: Features): boolean => {
  const config = useConfig()
  const { data: userData } = useGetUserQuery({
    projectId: config.projectId,
  })
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Checking for local environment override
    const envOverride = flags[feature]

    if (envOverride !== undefined) {
      setHasAccess(envOverride === 'true')
      return
    }

    if (userData && userData.user) {
      const posthogFlagEnabled = posthog.isFeatureEnabled(feature)
      const hogFlagIsTrue = posthogFlagEnabled === true

      const userHasAccess =
        featureList[feature].includes(userData.user.subscriptionName) ||
        featureList[feature].includes(userData.user.role) ||
        featureList[feature].includes(true) ||
        hogFlagIsTrue

      setHasAccess(userHasAccess)
    }
  }, [userData, feature])

  return hasAccess
}
