import Fetcher from './fetcher.js'
import Decoder from './decoder.js'
import Renderer from './renderer.js'
import Player from './player.js'
import EventEmitter from './event-emitter.js'
import Timer from './timer.js'

type WaveSurferOptions = {
  container: HTMLElement | string | null
  height?: number
  waveColor?: string
  progressColor?: string
  minPxPerSec?: number
  url?: string
  channelData?: Float32Array[]
  duration?: number
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

class WaveSurfer extends EventEmitter<WaveSurferEvents> {
  private options: WaveSurferOptions & typeof defaultOptions
  private fetcher: Fetcher
  private decoder: Decoder
  private renderer: Renderer
  private player: Player
  private timer: Timer

  private subscriptions: Array<() => void> = []
  private channelData: Float32Array[] | null = null
  private duration: number | null = null

  public static create(options: WaveSurferOptions) {
    return new WaveSurfer(options)
  }

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
      this.load(this.options.url, this.options.channelData, this.options.duration)
    }
  }

  private initPlayerEvents() {
    this.subscriptions.push(
      this.player.on('timeupdate', ({ currentTime }) => {
        this.renderer.renderProgress(currentTime / this.duration!, this.isPlaying())
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
    // The timer fires every 16ms for a smooth progress animation
    this.subscriptions.push(
      this.timer.on('tick', () => {
        if (this.player.isPlaying()) {
          const currentTime = this.player.getCurrentTime()
          this.renderer.renderProgress(currentTime / this.duration!, true)
          this.emit('timeupdate', { currentTime })
        }
      }),
    )
  }

  public destroy() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.timer.destroy()
    this.player.destroy()
    this.decoder.destroy()
    this.renderer.destroy()
  }

  public async load(url: string, channelData?: Float32Array[], duration?: number) {
    this.player.load(url)

    // Fetch and decode the audio of no pre-computed audio data is provided
    if (channelData == null || duration == null) {
      const audio = await this.fetcher.load(url)
      const data = await this.decoder.decode(audio)
      channelData = data.channelData
      duration = data.duration
    }

    this.channelData = channelData
    this.duration = duration

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

  public isPlaying(): boolean {
    return this.player.isPlaying()
  }
}

export default WaveSurfer
