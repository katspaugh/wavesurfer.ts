import EventBus from './event-bus.js'

type TimerEvents = {
  tick: {}
}

class Timer extends EventBus<TimerEvents> {
  private unsubscribe: () => void = () => undefined

  constructor() {
    super()

    this.unsubscribe = this.on('tick', () => {
      requestAnimationFrame(() => {
        this.emit('tick', {})
      })
    })

    this.emit('tick', {})
  }

  destroy() {
    this.unsubscribe()
  }
}

export default Timer
