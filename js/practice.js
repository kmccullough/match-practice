import { Events } from './events.js';

export const practice = new class PracticeService {
  events = new Events();

  on(event, callback) {
    return this.events.on(event, callback);
  }

  off(event, callback) {
    return this.events.off(event, callback);
  }

  start() {
    this.events.emitWithContext(this, 'start');
  }
};
