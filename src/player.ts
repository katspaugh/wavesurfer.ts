class Player {
  protected media: HTMLMediaElement
  private isExternalMedia = false

  constructor({ media, mediaType }: { media?: HTMLMediaElement; mediaType?: 'audio' | 'video' }) {
    if (media) {
      this.media = media
      this.isExternalMedia = true
    } else {
      this.media = document.createElement(mediaType || 'audio')
    }
  }

  on(event: keyof HTMLMediaElementEventMap, callback: () => void): () => void {
    this.media.addEventListener(event, callback)
    return () => this.media.removeEventListener(event, callback)
  }

  destroy() {
    if (!this.isExternalMedia) {
      this.media.remove()
    }
  }

  loadUrl(src: string) {
    this.media.src = src
  }

  getCurrentTime() {
    return this.media.currentTime
  }

  play() {
    this.media.play()
  }

  pause() {
    this.media.pause()
  }

  isPlaying() {
    return this.media.currentTime > 0 && !this.media.paused && !this.media.ended
  }

  seekTo(time: number) {
    this.media.currentTime = time
  }
}

export default Player
