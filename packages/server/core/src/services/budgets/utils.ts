import { Budget } from './budgets.schema'

export function calculateNextAlertTime(
  alertFrequency: Budget['alert_frequency'],
  lastAlertedAt: string
): Date | null {
  const alertedAtDate = new Date(lastAlertedAt)
  const nextAlertTime = new Date(alertedAtDate)

  switch (alertFrequency) {
    case 'daily':
      nextAlertTime.setDate(alertedAtDate.getDate() + 1)
      break
    case 'weekly':
      nextAlertTime.setDate(alertedAtDate.getDate() + 7)
      break
    case 'monthly':
      nextAlertTime.setMonth(alertedAtDate.getMonth() + 1)
      break
    case 'once':
      return null // No further alerts
  }
  return nextAlertTime
}

export function shouldSendAlert(
  updatedCost: number,
  currentBudget: Budget
): boolean {
  const alertThreshold =
    currentBudget.total_budget * currentBudget.alert_threshold
  const alertThresholdMet = updatedCost >= alertThreshold
  const nextAlertTime = calculateNextAlertTime(
    currentBudget.alert_frequency,
    currentBudget.alerted_at
  )

  if (!nextAlertTime) {
    return false // No more alerts are scheduled or alert is set to 'once'
  }

  const enoughTimePassed = new Date() >= nextAlertTime
  return alertThresholdMet && enoughTimePassed
}
