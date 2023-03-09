import Fetcher from './fetcher.js'
import Decoder from './decoder.js'
import Renderer from './renderer.js'
import Player from './player.js'
import EventBus from './event-bus.js'
import Timer from './timer.js'

type WaveSurferOptions = {
  container: HTMLElement | string | null
  height?: number
  waveColor?: string
  progressColor?: string
  minPxPerSec?: number
  url?: string
  channelData?: [Float32Array, Float32Array]
}

type WaveSurferEvents = {
  timeupdate: { currentTime: number }
  seek: { time: number }
}

const defaultOptions = {
  height: 128,
  waveColor: '#999',
  progressColor: '#555',
  minPxPerSec: 0,
}

class WaveSurfer extends EventBus<WaveSurferEvents> {
  public options: WaveSurferOptions & typeof defaultOptions
  private fetcher: Fetcher
  private decoder: Decoder
  private renderer: Renderer
  private player: Player
  private timer: Timer

  private subscriptions: Array<() => void> = []
  private channelData: [Float32Array, Float32Array] | null = null
  private duration: number | null = null

  constructor(options: WaveSurferOptions) {
    super()

    this.options = Object.assign({}, defaultOptions, options)

    this.fetcher = new Fetcher()
    this.decoder = new Decoder()
    this.player = new Player()
    this.timer = new Timer()

    this.renderer = new Renderer({
      container: this.options.container,
      height: this.options.height,
      waveColor: this.options.waveColor,
      progressColor: this.options.progressColor,
      minPxPerSec: this.options.minPxPerSec,
    })

    this.initPlayerEvents()
    this.initRendererEvents()
    this.initTimerEvents()

    if (this.options.url != null) {
      this.load(this.options.url, this.options.channelData)
    }
  }

  private updateRenderProgress(currentTime: number, autoCenter: boolean) {
    const duration = this.player.getDuration()
    this.renderer.renderProgress(currentTime / duration, autoCenter)
  }

  private initPlayerEvents() {
    this.subscriptions.push(
      this.player.on('timeupdate', ({ currentTime }) => {
        this.updateRenderProgress(currentTime, this.player.isPlaying())
        this.emit('timeupdate', { currentTime })
      }),
    )
  }

  private initRendererEvents() {
    // Seek on click
    this.subscriptions.push(
      this.renderer.on('click', ({ relativeX }) => {
        const duration = this.player.getDuration()
        const time = duration * relativeX
        this.player.seek(time)
        this.emit('seek', { time })
      }),
    )
  }

  private initTimerEvents() {
    this.subscriptions.push(
      // The timer fires every 16ms for a smooth progress animation
      this.timer.on('tick', () => {
        if (this.player.isPlaying()) {
          const currentTime = this.player.getCurrentTime()
          this.updateRenderProgress(currentTime, true)
          this.emit('timeupdate', { currentTime })
        }
      }),
    )
  }

  public destroy() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.timer.destroy()
    this.player.destroy()
    this.renderer.destroy()
  }

  public static create(options: WaveSurferOptions) {
    return new WaveSurfer(options)
  }

  public async load(url: string, channelData?: [Float32Array, Float32Array]) {
    this.player.load(url)

    if (channelData == null) {
      const audio = await this.fetcher.load(url)
      const data = await this.decoder.decode(audio)
      this.channelData = data.channelData
      this.duration = data.duration
    } else {
      this.channelData = channelData
      this.duration = this.player.getDuration()
    }

    this.renderer.render(this.channelData, this.duration)
  }

  public zoom(minPxPerSec: number) {
    if (this.channelData == null || this.duration == null) {
      throw new Error('No audio loaded')
    }
    this.renderer.render(this.channelData, this.duration, minPxPerSec)
  }

  public play() {
    this.player.play()
  }

  public pause() {
    this.player.pause()
  }

  public isPlaying() {
    return this.player.isPlaying()
  }
}

export default WaveSurfer
