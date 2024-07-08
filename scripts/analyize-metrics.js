const fs = require('fs')
const path = require('path')

const metricsDir = path.join(__dirname, '../dist/apps/agent-connector/metrics')

function analyzeMetricFile(fileContent) {
  const metrics = JSON.parse(fileContent).metricsOverTime

  const duration =
    (metrics[metrics.length - 1].timestamp - metrics[0].timestamp) / 1000
  const totalMessages = metrics[metrics.length - 1].messageCount

  const memoryUsage = metrics.map(m => m.memoryUsage.heapUsed)
  const cpuUsage = metrics.map(m => m.cpuPercentage)

  // Calculate message rate for each interval
  const messageRates = []
  for (let i = 1; i < metrics.length; i++) {
    const timeDiff = (metrics[i].timestamp - metrics[i - 1].timestamp) / 1000
    const messageDiff = metrics[i].messageCount - metrics[i - 1].messageCount
    if (timeDiff > 0) {
      messageRates.push(messageDiff / timeDiff)
    }
  }

  return {
    duration,
    totalMessages,
    avgMemoryUsage: memoryUsage.reduce((a, b) => a + b, 0) / memoryUsage.length,
    peakMemoryUsage: Math.max(...memoryUsage),
    avgCpuPercentage: cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length,
    peakCpuPercentage: Math.max(...cpuUsage),
    avgMessagesPerSecond: totalMessages / duration,
    peakMessagesPerSecond: Math.max(...messageRates),
  }
}

function analyzeAllMetrics() {
  const files = fs
    .readdirSync(metricsDir)
    .filter(file => file.startsWith('metrics-') && file.endsWith('.json'))
  const results = files.map(file =>
    analyzeMetricFile(fs.readFileSync(path.join(metricsDir, file), 'utf8'))
  )

  const concurrentUsers = results.length

  const overallStats = results.reduce(
    (acc, r) => {
      acc.totalMessages += r.totalMessages
      acc.totalDuration += r.duration
      acc.avgMemoryUsage.push(r.avgMemoryUsage)
      acc.peakMemoryUsage = Math.max(acc.peakMemoryUsage, r.peakMemoryUsage)
      acc.avgCpuPercentage.push(r.avgCpuPercentage)
      acc.peakCpuPercentage = Math.max(
        acc.peakCpuPercentage,
        r.peakCpuPercentage
      )
      acc.avgMessagesPerSecond += r.avgMessagesPerSecond
      acc.peakMessagesPerSecond = Math.max(
        acc.peakMessagesPerSecond,
        r.peakMessagesPerSecond
      )
      return acc
    },
    {
      totalMessages: 0,
      totalDuration: 0,
      avgMemoryUsage: [],
      peakMemoryUsage: 0,
      avgCpuPercentage: [],
      peakCpuPercentage: 0,
      avgMessagesPerSecond: 0,
      peakMessagesPerSecond: 0,
    }
  )

  overallStats.avgMemoryUsage =
    overallStats.avgMemoryUsage.reduce((a, b) => a + b, 0) / results.length
  overallStats.avgCpuPercentage =
    overallStats.avgCpuPercentage.reduce((a, b) => a + b, 0) / results.length
  overallStats.avgMessagesPerSecond /= results.length
  overallStats.numberOfChannels = results.length

  console.log(`Total messages processed: ${overallStats.totalMessages}`)
  console.log(
    `Total duration of all sessions: ${overallStats.totalDuration.toFixed(
      2
    )} seconds`
  )
  console.log(`Number of concurrent users: ${concurrentUsers}`)
  console.log(
    `Distributed duration: ${(
      overallStats.totalDuration / concurrentUsers
    ).toFixed(2)} seconds`
  )
  console.log(
    `Average memory usage: ${overallStats.avgMemoryUsage.toFixed(2)} MB`
  )
  console.log(
    `Peak memory usage: ${overallStats.peakMemoryUsage.toFixed(2)} MB`
  )
  console.log(`Average CPU usage: ${overallStats.avgCpuPercentage.toFixed(2)}%`)
  console.log(`Peak CPU usage: ${overallStats.peakCpuPercentage.toFixed(2)}%`)
  console.log(
    `Average messages processed per second (per channel): ${overallStats.avgMessagesPerSecond.toFixed(
      2
    )}`
  )
  console.log(
    `Peak messages processed per second (across all channels): ${overallStats.peakMessagesPerSecond.toFixed(
      2
    )}`
  )
  console.log(
    `Number of channels (concurrent users): ${overallStats.numberOfChannels}`
  )

  return overallStats
}

const analysisResults = analyzeAllMetrics()

// function calculateGCPRequirements(results, desiredMessagesPerSecond) {
//   const scaleFactor =
//     desiredMessagesPerSecond /
//     (results.avgMessagesPerSecond * results.numberOfChannels)
//   const estimatedMemory = results.peakMemoryUsage * scaleFactor
//   const estimatedCPUCores = (results.peakCpuPercentage / 100) * scaleFactor

//   return {
//     memory: Math.ceil(estimatedMemory / 256) * 256, // Round up to nearest 256 MB
//     cpuCores: Math.max(1, Math.ceil(estimatedCPUCores * 2) / 2), // At least 1 core, round up to nearest 0.5
//   }
// }

function calculateGCPRequirements(
  results,
  desiredMessagesPerSecond,
  marginOfError = 0.3
) {
  const baseScaleFactor =
    desiredMessagesPerSecond /
    (results.avgMessagesPerSecond * results.numberOfChannels)
  const nonLinearScaleFactor = Math.log10(baseScaleFactor) + 1
  const estimatedMemory = results.peakMemoryUsage * nonLinearScaleFactor
  const estimatedCPUCores =
    (results.peakCpuPercentage / 100) * nonLinearScaleFactor

  const memoryWithMargin = estimatedMemory * (1 + marginOfError)
  const cpuCoresWithMargin = estimatedCPUCores * (1 + marginOfError)

  return {
    memory: Math.ceil(memoryWithMargin / 256) * 256,
    cpuCores: Math.max(1, Math.ceil(cpuCoresWithMargin)),
  }
}

// Calculate GCP requirements for different scenarios
const scenarios = [
  { messagesPerSecond: 10 },
  { messagesPerSecond: 100 },
  { messagesPerSecond: 1000 },
  { messagesPerSecond: 10000 },
  { messagesPerSecond: 16.67 }, // 100 messages per minute
]

scenarios.forEach(scenario => {
  const requirements = calculateGCPRequirements(
    analysisResults,
    scenario.messagesPerSecond
  )
  console.log(
    `\nEstimated GCP container requirements for ${scenario.messagesPerSecond} messages/second:`
  )
  console.log(`Memory: ${requirements.memory} MB`)
  console.log(`CPU: ${requirements.cpuCores} cores`)
})
