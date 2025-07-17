import { routes } from './routes.js';
import { terms } from './terms.js';
import { Events } from '../util/events.js';

export const practice = new class PracticeService {
  events = new Events().setContext(this);
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
  crossTermMatches;
  crossMatchTerms;

  get termCount() {
    return (this.roundCount ?? 0) * (this.termCountPerRound ?? 0);
  }

  start() {
    this.nextTermIndex = 0;
    const cross = [
      this.crossTermMatches = new Map,
      this.crossMatchTerms = new Map,
    ];
    this.terms = terms.getRandomByCount(this.termCount)
      .map((term, index) => {
        const terms = [ term.term, term.match ];
        for (let i = 0; i < 2; ++i) {
          let matches = cross[i].get(terms[i]);
          if (!matches) {
            cross[i].set(terms[i], matches = []);
          }
          matches.push(terms[i ? 0 : 1]);
        }
        return { ...term, index };
      });
    this.incorrectCount = 0;
    this.events.emit('start');
    routes.transitionTo('practice');
  }

  consumeTerms(count) {
    const { nextTermIndex } = this;
    this.nextTermIndex += count;
    return this.terms.slice(nextTermIndex, this.nextTermIndex);
  }
};
