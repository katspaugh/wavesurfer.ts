import EventEmitter from './event-emitter.js'

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

class Renderer extends EventEmitter<RendererEvents> {
  private options: RendererOptions
  private container: HTMLElement
  private mainCanvas: HTMLCanvasElement
  private progressCanvas: HTMLCanvasElement
  private progressDiv: HTMLElement

  constructor(options: RendererOptions) {
    super()

    this.options = options

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
    const shadow = div.attachShadow({ mode: 'open' })
    const { height, progressColor } = this.options

    shadow.innerHTML = `
      <style>
        :host {
          position: relative;
          height: ${height}px;
          overflow: auto;
          user-select: none;
        }
        :host div {
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          overflow: hidden;
          border-right: 1px solid ${progressColor};
          pointer-events: none;
        }
        :host canvas {
          height: 100%;
          min-width: 100%;
          image-rendering: pixelated;
        }
      </style>

      <canvas height="${height}"></canvas>

      <div>
        <canvas height="${height}"></canvas>
      </div>
    `

    this.container = div
    this.mainCanvas = shadow.querySelector('canvas')!
    this.progressDiv = shadow.querySelector('div')!
    this.progressCanvas = this.progressDiv.querySelector('canvas')!

    container.appendChild(div)

    this.mainCanvas.addEventListener('click', (e) => {
      const rect = this.mainCanvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const relativeX = x / rect.width
      this.emit('click', { relativeX })
    })
  }

  destroy() {
    this.container.remove()
  }

  render(channels: Float32Array[], duration: number, minPxPerSec = this.options.minPxPerSec) {
    const ctx = this.mainCanvas.getContext('2d', { desynchronized: true })!
    const { devicePixelRatio } = window

    const newWidth = Math.max(this.container.clientWidth * devicePixelRatio, duration * minPxPerSec)

    if (newWidth != this.mainCanvas.width) {
      this.mainCanvas.width = this.progressCanvas.width = newWidth
      this.mainCanvas.style.width = this.progressCanvas.style.width = Math.round(newWidth / devicePixelRatio) + 'px'
    }

    const { width, height } = this.mainCanvas

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    // Draw left channel in the top half of the canvas
    const leftChannel = channels[0]
    let prevX = -1
    let prevY = 0
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
    const isMono = channels.length === 1
    const rightChannel = isMono ? leftChannel : channels[1]
    prevX = -1
    prevY = 0
    for (let i = rightChannel.length - 1; i >= 0; i--) {
      const x = Math.round((i / rightChannel.length) * width)
      const y = Math.round(((1 + rightChannel[i]) * height) / 2)
      if (x !== prevX || (isMono ? y < -prevY : y > prevY)) {
        ctx.lineTo(x, y)
        prevX = x
        prevY = y
      }
    }

    ctx.strokeStyle = ctx.fillStyle = this.options.waveColor
    ctx.stroke()
    ctx.fill()

    const progressCtx = this.progressCanvas.getContext('2d', { desynchronized: true })!
    progressCtx.drawImage(this.mainCanvas, 0, 0)
    progressCtx.globalCompositeOperation = 'source-in'
    progressCtx.fillStyle = this.options.progressColor
    progressCtx.fillRect(0, 0, this.progressCanvas.width, this.progressCanvas.height)
  }

  renderProgress(progress: number, autoCenter = false) {
    const fullWidth = this.mainCanvas.clientWidth
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
