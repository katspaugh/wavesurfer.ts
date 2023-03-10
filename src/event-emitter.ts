export interface GeneralEventTypes {
  // the name of the event and the data it dispatches with
  // e.g. 'entryCreated': { count: 1 }
  [eventType: string]: unknown
}

class EventEmitter<EventTypes extends GeneralEventTypes> {
  private eventTarget: EventTarget

  constructor() {
    this.eventTarget = new EventTarget()
  }

  protected emit<T extends keyof EventTypes>(eventType: T, detail: EventTypes[T]): void {
    const e = new CustomEvent(String(eventType), { detail })
    this.eventTarget.dispatchEvent(e)
  }

  /** Subscribe to an event and return a function to unsubscribe */
  on<T extends keyof EventTypes>(eventType: T, callback: (detail: EventTypes[T]) => void): () => void {
    const handler = (e: Event) => {
      if (e instanceof CustomEvent) {
        callback(e.detail)
      }
    }

    const eventName = String(eventType)

    this.eventTarget.addEventListener(eventName, handler)

    return () => this.eventTarget.removeEventListener(eventName, handler)
  }
}

export default EventEmitter
