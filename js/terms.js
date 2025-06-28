import { inputTermsEl, practiceTermsEl } from './elements.js';
import { inputTermsRowFactory } from './component/input-terms/row.js';
import PracticeTermsRowComponent from './component/practice-terms/row.js';
import PracticeTermComponent from './component/practice-terms/row/term.js';

export const terms = new class TermsService {
  terms = [];

  addTerm(term, match) {
    const inputTermRowEl = inputTermsRowFactory();
    const inputTermEl =  inputTermRowEl.querySelector('.input-term input');
    const inputMatchEl =  inputTermRowEl.querySelector('.input-match input');
    inputTermEl.value = term;
    inputMatchEl.value = match;
    inputTermsEl.append(inputTermRowEl);

    const termRowCmp = PracticeTermsRowComponent();
    const termRowEl = termRowCmp.element;
    const termCmp = PracticeTermComponent();
    const termEl = termCmp.element;
    termEl.innerText = term;
    const matchCmp = PracticeTermComponent();
    const matchEl = matchCmp.element;
    matchEl.innerText = match;
    termRowEl.append(termEl, matchEl);
    practiceTermsEl.append(termRowEl);

    this.terms.push({ term, match });
  }

  getRandom() {
    return this.terms[Math.floor(Math.random() * this.terms.length)];
  }
};
