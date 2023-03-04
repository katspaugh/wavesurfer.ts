import EventBus from './event-bus.js'

type RendererOptions = {
  container: HTMLElement
  height: number
  waveColor: string
  progressColor: string
  minPxPerSec?: number
}

type RendererEvents = {
  click: { x: number }
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

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const relX = e.clientX - rect.left
      const x = relX / rect.width
      this.dispatch('click', { x })
    })
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
    div.style.width = '100%'
    div.style.height = `${this.options.height}px`
    div.style.overflow = 'auto'
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
    div.style.pointerEvents = 'none'
    div.appendChild(this.progressCanvas)
    return div
  }

  render(channels: [Float32Array, Float32Array], sampleRate: number) {
    const ctx = this.canvas.getContext('2d')!

    // Render audio data as a waveform
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.beginPath()
    ctx.moveTo(0, this.canvas.height / 2)

    const { minPxPerSec = 0 } = this.options
    // Calculate the size of the waveform based on the number of samples, sample rate, and minPxPerSec
    const seconds = channels[0].length / sampleRate
    const newWidth = Math.max(this.canvas.width, seconds * minPxPerSec)

    if (newWidth > this.canvas.width) {
      this.canvas.width = this.progressCanvas.width = newWidth
      this.canvas.style.width = this.progressCanvas.style.width = Math.round(newWidth / window.devicePixelRatio) + 'px'
    }

    const { width, height } = this.canvas
    let prevX = 0
    let prevY = 0

    // Draw left channel in the top half of the canvas
    const leftChannel = channels[0]
    for (let i = 0; i < leftChannel.length; i++) {
      const x = Math.round((i / leftChannel.length) * width)
      const y = Math.round(((1 - leftChannel[i]) * height) / 2)
      if (x !== prevX || y !== prevY) {
        ctx.lineTo(x, y)
        prevX = x
        prevY = y
      }
    }

    // Draw right channel in the bottom half of the canvas
    const rightChannel = channels[1]
    for (let i = rightChannel.length - 1; i >= 0; i--) {
      const x = Math.round((i / rightChannel.length) * width)
      const y = Math.round(((1 + rightChannel[i]) * height) / 2)
      if (x !== prevX || y !== prevY) {
        ctx.lineTo(x, y)
        prevX = x
        prevY = y
      }
    }

    ctx.strokeStyle = this.options.waveColor
    ctx.stroke()

    const progressCtx = this.progressCanvas.getContext('2d')!
    progressCtx.drawImage(this.canvas, 0, 0)
    progressCtx.globalCompositeOperation = 'source-in'
    progressCtx.fillStyle = this.options.progressColor
    progressCtx.fillRect(0, 0, this.progressCanvas.width, this.progressCanvas.height)
  }

  renderProgress(progress: number) {
    const width = this.canvas.clientWidth
    this.progressDiv.style.width = `${Math.round(width * progress)}px`
  }
}

export default Renderer
