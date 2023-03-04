class Decoder {
  audioCtx: AudioContext

  constructor() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  public async decode(audioData: ArrayBuffer): Promise<[Float32Array, Float32Array]> {
    const buffer = await this.audioCtx.decodeAudioData(audioData)
    const left = buffer.getChannelData(0)
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left
    return [left, right]
  }
}

export default Decoder
