class Decoder {
  audioCtx: AudioContext

  constructor() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  public async decode(audioData: ArrayBuffer): Promise<{
    sampleRate: number
    channelData: [Float32Array, Float32Array]
  }> {
    const buffer = await this.audioCtx.decodeAudioData(audioData)
    const left = buffer.getChannelData(0)
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left
    return {
      channelData: [left, right],
      sampleRate: buffer.sampleRate,
    }
  }
}

export default Decoder
