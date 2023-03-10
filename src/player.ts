import EventEmitter from './event-emitter.js'

type PlayerEvents = {
  play: void
  pause: void
  timeupdate: { currentTime: number }
}

class Player extends EventEmitter<PlayerEvents> {
  private media: HTMLAudioElement

  constructor() {
    super()

    this.media = document.createElement('audio')

    this.media.addEventListener('play', () => {
      this.emit('play', undefined)
    })

    this.media.addEventListener('pause', () => {
      this.emit('pause', undefined)
    })

    this.media.addEventListener('timeupdate', () => {
      this.emit('timeupdate', { currentTime: this.media.currentTime })
    })
  }

  destroy() {
    this.media.remove()
  }

  load(src: string) {
    this.media.src = src
  }

  getCurrentTime() {
    return this.media.currentTime
  }

  play() {
    if (!this.isPlaying()) {
      this.media.play()
    }
  }

  pause() {
    if (this.isPlaying()) {
      this.media.pause()
    }
  }

  isPlaying() {
    return !this.media.paused
  }

  seek(time: number) {
    if (this.media.seekable) {
      this.media.currentTime = time
    }
  }
}

export default Player
