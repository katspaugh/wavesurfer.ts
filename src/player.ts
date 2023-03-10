import EventEmitter from './event-emitter.js'

type PlayerEvents = {
  play: {}
  pause: {}
  timeupdate: { currentTime: number }
}

class Player extends EventEmitter<PlayerEvents> {
  private media: HTMLAudioElement

  constructor() {
    super()

    this.media = document.createElement('audio')

    this.media.addEventListener('play', () => {
      this.emit('play', {})
    })

    this.media.addEventListener('pause', () => {
      this.emit('pause', {})
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

  getDuration() {
    return this.media.duration
  }

  getCurrentTime() {
    return this.media.currentTime
  }

  play() {
    if (!this.isPlaying() && this.getDuration()) {
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
