export class Events {
  events = {};
  timers = {};
  debounce = {};
  defaultDebounce;

  constructor() {
    this.setContext(this);
  }

  on(event, callback) {
    const events = this.events[event] ??= new Set;
    events.add(callback);
    return this;
  }

  off(event, callback) {
    const events = this.events[event];
    if (!events) {
      return;
    }
    events.delete(callback);
    return this;
  }

  setContext(context) {
    this.context = context;
    return this;
  }

  setDebounce(event, debounce) {
    if (arguments.length === 1) {
      debounce = event;
      event = null;
    }
    if (!event) {
      this.defaultDebounce = debounce;
    } else {
      this.debounce[event] = debounce;
    }
    return this;
  }

  emitWithOptions(event, options = {}) {
    const args = options.arguments || options.args || [];
    const context = 'context' in options ? options.context : this.context;
    const debounce = 'debounce' in options ? options.debounce
      : event in this.debounce ? this.debounce[event] : this.defaultDebounce;
    const events = this.events[event];
    if (!events) {
      return;
    }
    const emit = () => events.forEach(event => event?.call?.(context, ...args));
    if (debounce || debounce === 0) {
      if (this.timers[event]) {
        clearTimeout(this.timers[event]);
        this.timers[event] = null;
      }
      this.timers[event] = setTimeout(emit, debounce === true ? 0 : debounce);
    } else {
      emit();
    }
    return this;
  }

  emit(event, ...args) {
    return this.emitWithOptions(event, { args });
  }
}
