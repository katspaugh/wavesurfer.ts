import Fetcher from './fetcher.js'
import Decoder from './decoder.js'
import Renderer from './renderer.js'
import Player from './player.js'

type WaveSurferOptions = {
  container: HTMLElement | string | null
  height?: number
  waveColor?: string
  progressColor?: string
  minPxPerSec?: number
}

const defaultOptions = {
  height: 128,
  waveColor: '#999',
  progressColor: '#555',
}

class WaveSurfer {
  public options: WaveSurferOptions & typeof defaultOptions
  private container: HTMLElement
  private fetcher: Fetcher
  private decoder: Decoder
  private renderer: Renderer
  private player: Player
  private subscriptions: Array<() => void> = []

  constructor(options: WaveSurferOptions) {
    this.options = Object.assign({}, defaultOptions, options)
    this.container = this.initContainer()

    this.fetcher = new Fetcher()
    this.decoder = new Decoder()
    this.player = new Player({ container: this.container })

    this.renderer = new Renderer({
      ...defaultOptions,
      container: this.container,
      height: this.options.height,
      waveColor: this.options.waveColor,
      progressColor: this.options.progressColor,
      minPxPerSec: this.options.minPxPerSec,
    })

    // Subscribe to UI events
    // Seek on click
    this.subscriptions[this.subscriptions.length] = this.renderer.subscribe('click', ({ x }) => {
      const duration = this.player.getDuration()
      const position = duration * x
      this.player.seek(position)
    })

    // Subscribe to player events
    // Update the renderer progress on play
    this.subscriptions[this.subscriptions.length] = this.player.subscribe('timeupdate', ({ currentTime }) => {
      const duration = this.player.getDuration()
      this.renderer.renderProgress(currentTime / duration)
    })
  }

  public destroy() {
    this.player.destroy()
    this.renderer.destroy()
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
  }

  private initContainer(): HTMLElement {
    let container: Element | null = null
    if (typeof this.options.container === 'string') {
      container = document.querySelector(this.options.container)
    } else {
      container = this.options.container
    }
    if (!container) {
      throw new Error('Container not found')
    }
    return container as HTMLElement
  }

  public static create(options: WaveSurferOptions) {
    return new WaveSurfer(options)
  }

  public async load(url: string) {
    const audio = await this.fetcher.load(url)
    const data = await this.decoder.decode(audio)

    this.renderer.render(data.channelData, data.sampleRate)
    this.player.load(url)
  }
}

export default WaveSurfer
