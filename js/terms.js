import { shuffle } from './array.js';
import { inputTermsRowFactory } from './component/input-terms/row.js';
import { select } from './element.js';
import { termsEl } from './elements.js';

export const terms = new class TermsService {
  terms = [];

  addTerm(term, match) {
    const inputTermRowEl = inputTermsRowFactory();
    const inputTermEl =  inputTermRowEl.querySelector('.input-term input');
    const inputMatchEl =  inputTermRowEl.querySelector('.input-match input');
    inputTermEl.value = term;
    inputMatchEl.value = match;
    select('.input-terms-list-list', termsEl).append(inputTermRowEl);

    this.terms.push({ term, match });
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
