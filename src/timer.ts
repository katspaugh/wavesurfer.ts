import EventEmitter from './event-emitter.js'

type TimerEvents = {
  tick: {}
}

class Timer extends EventEmitter<TimerEvents> {
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
