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
  termCountPerRound = 5;
  correctDisplayTime = 500;
  correctFillDelay = 500;
  incorrectDisplayTime = 500;
  incorrectSelectionDelay = 0;
  nextTermIndex = 0;
  terms = [];
  incorrectCount;

  get termCount() {
    return (this.roundCount ?? 0) * (this.termCountPerRound ?? 0);
  }

  start() {
    this.nextTermIndex = 0;
    this.terms = terms.getRandomByCount(this.termCount)
      .map((term, index) => ({ ...term, index }));
    this.incorrectCount = 0;
    this.events.emitWithContext(this, 'start');
  }

  consumeTerms(count) {
    const { nextTermIndex } = this;
    this.nextTermIndex += count;
    return this.terms.slice(nextTermIndex, this.nextTermIndex);
  }
};
