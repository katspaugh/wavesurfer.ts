// Web Audio decodeAudioData with a minimum allowed sample rate
const SAMPLE_RATE = 3000

class Decoder {
  audioCtx: AudioContext | null = null

  constructor() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'playback',
      sampleRate: SAMPLE_RATE,
    })
  }

  public async decode(audioData: ArrayBuffer): Promise<{
    duration: number
    channelData: Float32Array[]
  }> {
    if (!this.audioCtx) {
      throw new Error('AudioContext is not initialized')
    }

    const buffer = await this.audioCtx.decodeAudioData(audioData)
    const channelData = [buffer.getChannelData(0)]
    if (buffer.numberOfChannels > 1) {
      channelData.push(buffer.getChannelData(1))
    }

    return {
      duration: buffer.duration,
      channelData,
    }
  }

  destroy() {
    this.audioCtx?.close()
    this.audioCtx = null
  }
}

export default Decoder
