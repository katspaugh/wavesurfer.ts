import EventBus from './event-bus.js'

type RendererOptions = {
  container: HTMLElement
  height: number
  waveColor: string
  progressColor: string
}

type RendererEvents = {
  click: (x: number) => void
}

class Renderer extends EventBus<RendererEvents> {
  private options: RendererOptions
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private progressCanvas: HTMLCanvasElement
  private progressDiv: HTMLElement

  constructor(options: RendererOptions) {
    super()

    this.options = options

    this.canvas = this.initCanvas()
    this.progressCanvas = this.initCanvas()
    this.progressDiv = this.initProgressDiv()
    this.container = this.initContainer()
  }

  destroy() {
    this.container.remove()
  }

  private initCanvas(): HTMLCanvasElement {
    const height = this.options.height
    const canvas = document.createElement('canvas')
    const containerWidth = this.options.container.clientWidth
    canvas.width = containerWidth * window.devicePixelRatio
    canvas.height = height
    canvas.style.width = '100%'
    canvas.style.height = `${height}px`
    return canvas
  }

  private initContainer(): HTMLElement {
    const div = document.createElement('div')
    div.style.position = 'relative'
    div.style.height = `${this.options.height}px`
    div.appendChild(this.canvas)
    div.appendChild(this.progressDiv)
    this.options.container.appendChild(div)
    return div
  }

  private initProgressDiv(): HTMLElement {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.zIndex = '2'
    div.style.top = '0'
    div.style.left = '0'
    div.style.width = '0'
    div.style.height = '100%'
    div.style.overflow = 'hidden'
    div.style.borderRight = `1px solid ${this.options.progressColor}`
    div.appendChild(this.progressCanvas)
    return div
  }

  render(channels: [Float32Array, Float32Array]) {
    const ctx = this.canvas.getContext('2d')!

    ctx.strokeStyle = this.options.waveColor

    // Render audio data as a waveform
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.moveTo(0, this.canvas.height / 2)

    // Draw left channel in the top half of the canvas
    for (let i = 0; i < channels[0].length; i++) {
      const x = Math.round((i / channels[0].length) * this.canvas.width)
      const y = Math.round(((1 - channels[0][i]) * this.canvas.height) / 2)
      ctx.lineTo(x, y)
    }

    // Draw right channel in the bottom half of the canvas
    for (let i = channels[1].length - 1; i >= 0; i--) {
      const x = Math.round((i / channels[1].length) * this.canvas.width)
      const y = Math.round(((1 + channels[1][i]) * this.canvas.height) / 2)
      ctx.lineTo(x, y)
    }

    ctx.stroke()

    const progressCtx = this.progressCanvas.getContext('2d')!
    progressCtx.drawImage(this.canvas, 0, 0)
    progressCtx.globalCompositeOperation = 'source-in'
    progressCtx.fillStyle = this.options.progressColor
    progressCtx.fillRect(0, 0, this.progressCanvas.width, this.progressCanvas.height)
  }

  renderProgress(progress: number) {
    const containerWidth = this.container.clientWidth
    this.progressCanvas.style.width = `${containerWidth}px`
    this.progressDiv.style.width = `${Math.round(containerWidth * progress)}px`
  }
}

export default Renderer
