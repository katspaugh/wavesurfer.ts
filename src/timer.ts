import EventEmitter from './event-emitter.js'

type TimerEvents = {
  tick: void
}

class Timer extends EventEmitter<TimerEvents> {
  private unsubscribe: () => void = () => undefined

  constructor() {
    super()

    this.unsubscribe = this.on('tick', () => {
      requestAnimationFrame(() => {
        this.emit('tick', undefined)
      })
    })

    this.emit('tick', undefined)
  }

  destroy() {
    this.unsubscribe()
  }
}

export default Timer
