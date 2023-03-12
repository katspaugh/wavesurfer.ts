import Player from './player.js'

class WebAudioPlayer extends Player {
  audioCtx: AudioContext | null = null
  sourceNode: MediaElementAudioSourceNode | null = null

  destroy() {
    this.sourceNode?.disconnect()
    this.sourceNode = null
    this.audioCtx?.close()
    this.audioCtx = null

    super.destroy()
  }

  loadUrl(url: string) {
    super.loadUrl(url)

    if (!this.audioCtx) {
      this.audioCtx = new AudioContext({
        latencyHint: 'playback',
      })
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect()
    }
    this.sourceNode = this.audioCtx.createMediaElementSource(this.media)
    this.sourceNode.connect(this.audioCtx.destination)
  }
}

export default WebAudioPlayer
