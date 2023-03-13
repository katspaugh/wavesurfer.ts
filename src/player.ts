class Player {
  protected media: HTMLMediaElement | null = null
  private isExternalMedia = false

  constructor({ media }: { media?: HTMLMediaElement }) {
    if (media) {
      this.media = media
      this.isExternalMedia = true
    } else {
      this.media = document.createElement('audio')
    }
  }

  on(event: keyof HTMLMediaElementEventMap, callback: () => void): () => void {
    this.media?.addEventListener(event, callback)
    return () => this.media?.removeEventListener(event, callback)
  }

  destroy() {
    this.media?.pause()

    if (!this.isExternalMedia) {
      this.media?.remove()
      this.media = null
    }
  }

  loadUrl(src: string) {
    if (this.media) {
      this.media.src = src
    }
  }

  getCurrentTime() {
    return this.media?.currentTime || 0
  }

  play() {
    this.media?.play()
  }

  pause() {
    this.media?.pause()
  }

  isPlaying() {
    if (!this.media) return false
    return this.media.currentTime > 0 && !this.media.paused && !this.media.ended
  }

  seekTo(time: number) {
    if (this.media) {
      this.media.currentTime = time
    }
  }
}

export default Player
