import Fetcher from './fetcher.js'
import Decoder from './decoder.js'
import Renderer from './renderer.js'
import Player from './player.js'
import EventEmitter from './event-emitter.js'
import Timer from './timer.js'

export type WaveSurferOptions = {
  /** HTML element or CSS selector */
  container: HTMLElement | string | null
  /** Height of the waveform in pixels */
  height?: number
  /** The color of the waveform */
  waveColor?: string
  /** The color of the progress mask */
  progressColor?: string
  /** Minimum pixels per second of audio (zoom) */
  minPxPerSec?: number
  /** Audio URL */
  url?: string
  /** Pre-computed audio data */
  channelData?: Float32Array[]
  /** Pre-computed duration */
  duration?: number
}

export type WaveSurferEvents = {
  ready: { duration: number }
  timeupdate: { currentTime: number }
  seek: { time: number }
  play: void
  pause: void
}

const defaultOptions = {
  height: 128,
  waveColor: '#999',
  progressColor: '#555',
  minPxPerSec: 0,
}

export class WaveSurfer extends EventEmitter<WaveSurferEvents> {
  private options: WaveSurferOptions & typeof defaultOptions
  private fetcher: Fetcher
  private decoder: Decoder
  private renderer: Renderer
  private player: Player
  private timer: Timer

  private subscriptions: Array<() => void> = []
  private channelData: Float32Array[] | null = null
  private duration = 0

  /** Create a new WaveSurfer instance */
  public static create(options: WaveSurferOptions) {
    return new WaveSurfer(options)
  }

  /** Create a new WaveSurfer instance */
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
        this.renderer.renderProgress(currentTime / this.duration, this.isPlaying())
        this.emit('timeupdate', { currentTime })
      }),

      this.player.on('play', () => {
        this.emit('play', undefined)
      }),

      this.player.on('pause', () => {
        this.emit('pause', undefined)
      }),
    )
  }

  private initRendererEvents() {
    // Seek on click
    this.subscriptions.push(
      this.renderer.on('click', ({ relativeX }) => {
        const time = this.getDuration() * relativeX
        this.player.seek(time)
        this.emit('seek', { time })
      }),
    )
  }

  private initTimerEvents() {
    // The timer fires every 16ms for a smooth progress animation
    this.subscriptions.push(
      this.timer.on('tick', () => {
        if (this.isPlaying()) {
          const currentTime = this.getCurrentTime()
          this.renderer.renderProgress(currentTime / this.duration, true)
          this.emit('timeupdate', { currentTime })
        }
      }),
    )
  }

  /** Unmount wavesurfer */
  public destroy() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.timer.destroy()
    this.player.destroy()
    this.decoder.destroy()
    this.renderer.destroy()
  }

  /** Load an audio file by URL */
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

    this.emit('ready', { duration: this.duration })
  }

  /** Zoom in or out */
  public zoom(minPxPerSec: number) {
    if (this.channelData == null || this.duration == null) {
      throw new Error('No audio loaded')
    }
    this.renderer.render(this.channelData, this.duration, minPxPerSec)
  }

  /** Start playing the audio */
  public play() {
    this.player.play()
  }

  /** Pause the audio */
  public pause() {
    this.player.pause()
  }

  /** Check if the audio is playing */
  public isPlaying(): boolean {
    return this.player.isPlaying()
  }

  /** Get the duration of the audio in seconds */
  public getDuration(): number {
    return this.duration
  }

  /** Get the current audio position in seconds */
  public getCurrentTime(): number {
    return this.player.getCurrentTime()
  }
}

export default WaveSurfer
