export class Events {
  events = {};

  on(event, callback) {
    const events = this.events[event] ??= new Set;
    events.add(callback);
  }

  off(event, callback) {
    const events = this.events[event];
    if (!events) {
      return;
    }
    events.delete(callback);
  }

  emitWithContext(context, event, ...args) {
    const events = this.events[event];
    if (!events) {
      return;
    }
    events.forEach(event => {
      event?.(...args);
    });
  }

  emit = (self => function(event, ...args) {
    return self.emitWithContext(this, event, ...args);
  })(this);
}
