import EventEmitter, { type GeneralEventTypes } from './event-emitter.js'
import type { WaveSurfer, WaveSurferPluginParams } from './index.js'

export class BasePlugin<EventTypes extends GeneralEventTypes> extends EventEmitter<EventTypes> {
  protected wavesurfer: WaveSurfer
  protected renderer: WaveSurfer['renderer']
  protected subscriptions: (() => void)[] = []

  constructor(params: WaveSurferPluginParams) {
    super()
    this.wavesurfer = params.wavesurfer
    this.renderer = params.renderer
  }

  destroy() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
  }
}

export default BasePlugin
