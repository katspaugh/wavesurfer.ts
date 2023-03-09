import EventBus from './event-bus.js'

type RendererOptions = {
  container: HTMLElement | string | null
  height: number
  waveColor: string
  progressColor: string
  minPxPerSec: number
}

type RendererEvents = {
  click: { relativeX: number }
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

    this.container = this.initContainer()
    this.canvas = this.initCanvas()
    this.progressCanvas = this.initCanvas()
    this.progressDiv = this.initProgressDiv()

    this.container.appendChild(this.canvas)
    this.container.appendChild(this.progressDiv)

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const relativeX = x / rect.width
      this.emit('click', { relativeX })
    })
  }

  destroy() {
    this.container.remove()
  }

  private initCanvas(): HTMLCanvasElement {
    const height = this.options.height
    const canvas = document.createElement('canvas')
    const containerWidth = this.container.clientWidth
    canvas.width = containerWidth * window.devicePixelRatio
    canvas.height = height
    canvas.style.width = '100%'
    canvas.style.height = `${height}px`
    return canvas
  }

  private initContainer(): HTMLElement {
    let container: HTMLElement | null = null
    if (typeof this.options.container === 'string') {
      container = document.querySelector(this.options.container)
    } else if (this.options.container instanceof HTMLElement) {
      container = this.options.container
    }
    if (!container) {
      throw new Error('Container not found')
    }

    const div = document.createElement('div')
    div.style.position = 'relative'
    div.style.width = '100%'
    div.style.height = `${this.options.height}px`
    div.style.overflow = 'auto'
    container.appendChild(div)
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

  render(channels: [Float32Array, Float32Array], duration: number, minPxPerSec = this.options.minPxPerSec) {
    const ctx = this.canvas.getContext('2d', { desynchronized: true })!
    const { devicePixelRatio } = window

    const newWidth = Math.max(this.container.clientWidth * devicePixelRatio, duration * minPxPerSec)

    if (newWidth != this.canvas.width) {
      this.canvas.width = this.progressCanvas.width = newWidth
      this.canvas.style.width = this.progressCanvas.style.width = Math.round(newWidth / devicePixelRatio) + 'px'
    }

    const { width, height } = this.canvas
    let prevX = 0
    let prevY = 0

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    // Draw left channel in the top half of the canvas
    const leftChannel = channels[0]
    for (let i = 0; i < leftChannel.length; i++) {
      const x = Math.round((i / leftChannel.length) * width)
      const y = Math.round(((1 - leftChannel[i]) * height) / 2)
      if (x !== prevX || y > prevY) {
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
      if (x !== prevX || y > prevY) {
        ctx.lineTo(x, y)
        prevX = x
        prevY = y
      }
    }

    ctx.strokeStyle = this.options.waveColor
    ctx.stroke()

    const progressCtx = this.progressCanvas.getContext('2d', { desynchronized: true })!
    progressCtx.drawImage(this.canvas, 0, 0)
    progressCtx.globalCompositeOperation = 'source-in'
    progressCtx.fillStyle = this.options.progressColor
    progressCtx.fillRect(0, 0, this.progressCanvas.width, this.progressCanvas.height)
  }

  renderProgress(progress: number, autoCenter = false) {
    const fullWidth = this.canvas.clientWidth
    this.progressCanvas.style.width = fullWidth + 'px'
    this.progressDiv.style.width = `${Math.round(fullWidth * progress)}px`

    if (autoCenter) {
      const center = this.container.clientWidth / 2
      if (fullWidth * progress >= this.container.clientWidth / 2) {
        this.container.scrollLeft = fullWidth * progress - center
      }
    }
  }
}

export default Renderer
