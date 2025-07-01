import { Events } from './events.js';
import { terms } from './terms.js';

export const practice = new class PracticeService {
  events = new Events();

  on(event, callback) {
    return this.events.on(event, callback);
  }

  off(event, callback) {
    return this.events.off(event, callback);
  }

  roundCount = 6;
  termCount = 5;
  correctFillDelay = 500;
  incorrectSelectionDelay = 0;
  nextTermIndex = 0;
  terms = [];

  get count() {
    return (this.roundCount ?? 0) * (this.termCount ?? 0);
  }

  start() {
    this.nextTermIndex = 0;
    this.terms = terms.getRandomByCount(this.count)
      .map((term, index) => ({ ...term, index }));
    this.events.emitWithContext(this, 'start');
  }

  consumeTerms(count) {
    const { nextTermIndex } = this;
    this.nextTermIndex += count;
    return this.terms.slice(nextTermIndex, this.nextTermIndex);
  }
};
