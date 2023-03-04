import EventBus from './event-bus.js'

type UIOptions = {
  container: HTMLElement
}

type UIEvents = {
  click: { x: number }
}

class UI extends EventBus<UIEvents> {
  constructor({ container }: UIOptions) {
    super()

    container.addEventListener('click', (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      this.dispatch('click', { x })
    })
  }
}

export default UI
