import Fetcher from './fetcher.js'
import Decoder from './decoder.js'
import Renderer from './renderer.js'
import Player from './player.js'
import WebAudioPlayer from './player-webaudio.js'
import EventEmitter, { type GeneralEventTypes } from './event-emitter.js'
import Timer from './timer.js'
import BasePlugin from './base-plugin.js'

export enum PlayerType {
  WebAudio = 'WebAudio',
  MediaElement = 'MediaElement',
}

export type WaveSurferOptions = {
  /** HTML element or CSS selector */
  container: HTMLElement | string | null
  /** Height of the waveform in pixels */
  height?: number
  /** The color of the waveform */
  waveColor?: string
  /** The color of the progress mask */
  progressColor?: string
  /** If set, the waveform will be rendered in bars like so: ▁ ▂ ▇ ▃ ▅ ▂ */
  barWidth?: number
  /** Spacing between bars in pixels */
  barGap?: number
  /** Rounded borders for bars */
  barRadius?: number
  /** Minimum pixels per second of audio (zoom) */
  minPxPerSec?: number
  /** Audio URL */
  url?: string
  /** Pre-computed audio data */
  channelData?: Float32Array[]
  /** Pre-computed duration */
  duration?: number
  /** Player "backend", the default is MediaElement  */
  backend?: PlayerType
  /** Use an existing media element instead of creating one */
  media?: HTMLMediaElement
}

const defaultOptions = {
  height: 128,
  waveColor: '#999',
  progressColor: '#555',
  minPxPerSec: 0,
  backend: 'MediaElement',
}

export type WaveSurferEvents = {
  ready: { duration: number }
  canplay: void
  play: void
  pause: void
  audioprocess: { currentTime: number }
  seek: { time: number }
}

export type WaveSurferPluginParams = {
  wavesurfer: WaveSurfer
  renderer: WaveSurfer['renderer']
}

export class WaveSurfer extends EventEmitter<WaveSurferEvents> {
  private options: WaveSurferOptions & typeof defaultOptions

  private fetcher: Fetcher
  private decoder: Decoder
  private renderer: Renderer
  private player: Player
  private timer: Timer

  private plugins: BasePlugin<GeneralEventTypes>[] = []
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
    this.timer = new Timer()

    this.player = new (this.options.backend === PlayerType.WebAudio ? WebAudioPlayer : Player)({
      media: this.options.media,
    })

    this.renderer = new Renderer({
      container: this.options.container,
      height: this.options.height,
      waveColor: this.options.waveColor,
      progressColor: this.options.progressColor,
      minPxPerSec: this.options.minPxPerSec,
      barWidth: this.options.barWidth,
      barGap: this.options.barGap,
      barRadius: this.options.barRadius,
    })

    this.initPlayerEvents()
    this.initRendererEvents()
    this.initTimerEvents()

    const url = this.options.url || this.options.media?.src
    if (url) {
      this.load(url, this.options.channelData, this.options.duration)
    }
  }

  private initPlayerEvents() {
    this.subscriptions.push(
      this.player.on('timeupdate', () => {
        const currentTime = this.getCurrentTime()
        this.renderer.renderProgress(currentTime / this.duration, this.isPlaying())
        this.emit('audioprocess', { currentTime })
      }),

      this.player.on('play', () => {
        this.emit('play')
      }),

      this.player.on('pause', () => {
        this.emit('pause')
      }),

      this.player.on('canplay', () => {
        this.emit('canplay')
      }),

      this.player.on('seeking', () => {
        this.emit('seek', { time: this.getCurrentTime() })
      }),
    )
  }

  private initRendererEvents() {
    // Seek on click
    this.subscriptions.push(
      this.renderer.on('click', ({ relativeX }) => {
        const time = this.getDuration() * relativeX
        this.seekTo(time)
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
          this.emit('audioprocess', { currentTime })
        }
      }),
    )
  }

  /** Unmount wavesurfer */
  public destroy() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.plugins.forEach((plugin) => plugin.destroy())
    this.timer.destroy()
    this.player.destroy()
    this.decoder.destroy()
    this.renderer.destroy()
  }

  /** Load an audio file by URL */
  public async load(url: string, channelData?: Float32Array[], duration?: number) {
    this.player.loadUrl(url)

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
    this.renderer.zoom(this.channelData, this.duration, minPxPerSec)
  }

  /** Start playing the audio */
  public play() {
    this.player.play()
  }

  /** Pause the audio */
  public pause() {
    this.player.pause()
  }

  /** Skip to a time position in seconds */
  public seekTo(time: number) {
    this.player.seekTo(time)
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

  /** Register and initialize a plugin */
  public registerPlugin<T extends BasePlugin<GeneralEventTypes>>(
    CustomPlugin: new (params: WaveSurferPluginParams) => T,
  ): T {
    const plugin = new CustomPlugin({
      wavesurfer: this,
      renderer: this.renderer,
    })

    this.plugins.push(plugin)

    return plugin
  }
}

export default WaveSurfer
