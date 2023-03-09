// Web Audio decodeAudioData with a minimal sample rate
const MIN_SAMPLE_RATE = 3000

class Decoder {
  audioCtx: AudioContext

  constructor() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'playback',
      sampleRate: MIN_SAMPLE_RATE,
    })
  }

  public async decode(audioData: ArrayBuffer): Promise<{
    duration: number
    channelData: [Float32Array, Float32Array]
  }> {
    const buffer = await this.audioCtx.decodeAudioData(audioData)
    const left = buffer.getChannelData(0)
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left

    return {
      duration: buffer.duration,
      channelData: [left, right],
    }
  }
}

export default Decoder
