import EventBus from './event-bus.js'

type PlayerOptions = {
  container: HTMLElement
}

type PlayerEvents = {
  play: {}
  pause: {}
  timeupdate: { currentTime: number }
}

class Player extends EventBus<PlayerEvents> {
  public media: HTMLAudioElement

  constructor({ container }: PlayerOptions) {
    super()

    this.media = document.createElement('audio')
    container.appendChild(this.media)

    this.media.addEventListener('play', () => {
      this.dispatch('play', {})
    })

    this.media.addEventListener('pause', () => {
      this.dispatch('pause', {})
    })

    this.media.addEventListener('timeupdate', () => {
      this.dispatch('timeupdate', { currentTime: this.media.currentTime })
    })
  }

  destroy() {
    this.media.remove()
  }

  load(src: string) {
    this.media.src = src
  }

  getDuration() {
    return this.media.duration
  }

  play() {
    if (this.getDuration()) {
      this.media.play()
    }
  }

  seek(time: number) {
    if (this.media.seekable) {
      this.media.currentTime = time
    }
  }
}

export default Player
