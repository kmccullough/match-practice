import { shuffle } from '../util/array.js';
import { Events } from '../util/events.js';

export const terms = new class TermsService {
  /** @type {{ term: string, match: string }[]} */
  terms = [];
  nextId = 1;

  events = new Events().setContext(this)
    .setDebounce(true);
  on(event, callback) {
    return this.events.on(event, callback);
  }
  off(event, callback) {
    return this.events.off(event, callback);
  }

  addTerm(term, match) {
    this.terms.push({ id: this.nextId++, term, match });
    this.events.emit('change');
  }

  getRandom() {
    return this.terms[Math.floor(Math.random() * this.terms.length)];
  }

  getRandomByCount(count) {
    const terms = [];
    let shuffled;
    while (count > 0) {
      shuffled = this.getShuffled();
      count -= shuffled.length;
      terms.push(count >= 0 ? shuffled : shuffled.slice(0, count));
    }
    return terms.flat();
  }

  getShuffled() {
    return shuffle(this.terms.slice());
  }
};
