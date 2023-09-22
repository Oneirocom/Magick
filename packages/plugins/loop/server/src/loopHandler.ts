export class LoopHandler {
  private interval: NodeJS.Timeout
  private isPaused: boolean
  private fn: Function

  constructor(fn: Function, delay: number) {
    this.fn = fn
    this.isPaused = false
    this.interval = setInterval(async () => {
      if (!this.isPaused) {
        await this.fn()
      }
    }, delay)
  }

  destroy() {
    clearInterval(this.interval)
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  async step() {
    if (this.isPaused) {
      await this.fn()
    }
  }
}
