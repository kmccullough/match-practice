import { shuffle } from '../array.js';
import Component from '../component.js';
import { select } from '../element.js';
import { practiceTermsEl } from '../elements.js';
import { practice } from '../practice.js';
import PracticeTermsRowComponent from './practice-terms/row.js';
import PracticeTermComponent from './practice-terms/row/term.js';

export default Component.define

`<div class="terms terms-list"></div>`

(class extends Component {
  termsListElement;
  termElements;
  matchElements;
  emptyTermElements;
  emptyMatchElements;
  selectedElements;
  elementTermMap;
  elementMatchMap;

  constructor(element) {
    super(element);
    this.termsListElement = select('.terms-list', element);
    practice.on('start', () => {
      this.renderInitialTermElements();
      this.fillTerms();
    });
  }

  renderInitialTermElements() {
    this.selectedElements = [ null, null ];
    this.termElements = [];
    this.matchElements = [];
    this.emptyTermElements = [];
    this.emptyMatchElements = [];
    this.elementTermMap = new WeakMap();
    this.elementMatchMap = new WeakMap();

    this.termsListElement.innerText = '';

    const { termCount } = practice;
    for (let i = 0; i < termCount; ++i) {
      const termRowCmp = PracticeTermsRowComponent();
      const termRowEl = termRowCmp.element;

      const termCmp = PracticeTermComponent();
      const termEl = termCmp.element;
      termEl.addEventListener('click', () => this.selectElement(0, termEl));
      this.termElements.push(termEl);
      this.emptyTermElements.push(termEl);

      const matchCmp = PracticeTermComponent();
      const matchEl = matchCmp.element;
      matchEl.addEventListener('click', () => this.selectElement(1, matchEl));
      this.matchElements.push(matchEl);
      this.emptyMatchElements.push(matchEl);

      termRowEl.append(termEl, matchEl);
      practiceTermsEl.append(termRowEl);
    }
  }

  fillTerms() {
    const count = this.emptyMatchElements.length;
    if (!count) {
      return;
    }
    shuffle(this.emptyMatchElements);
    const terms = practice.consumeTerms(count);
    const {
      emptyTermElements, emptyMatchElements,
      elementTermMap, elementMatchMap,
    } = this;
    for (let i = 0; i < terms.length; ++i) {
      const term = terms[i];
      const termEl = emptyTermElements.shift();
      termEl.innerText = term.term;
      elementTermMap.set(termEl, term);
      const matchEl = emptyMatchElements.shift();
      matchEl.innerText = term.match;
      elementMatchMap.set(matchEl, term);
    }
  }

  selectElement(selectionIndex, element) {
    if (this.selectedElements[selectionIndex]) {
      this.selectedElements[selectionIndex].classList.remove('selected', 'incorrect');
    }
    this.selectedElements[selectionIndex] = element;
    element.classList.add('selected');
    this.checkForTermMatch();
  }

  checkForTermMatch() {
    const [ termEl, matchEl ] = this.selectedElements;
    if (!( termEl && matchEl )) {
      return;
    }
    const term = this.elementTermMap.get(termEl);
    const isMatch = term === this.elementMatchMap.get(matchEl);
    const oldClass = isMatch ? 'incorrect' : 'correct';
    const newClass = isMatch ? 'correct' : 'incorrect';
    termEl.classList.remove(oldClass, 'selected');
    termEl.classList.add(newClass);
    matchEl.classList.remove(oldClass, 'selected');
    matchEl.classList.add(newClass);
    this.selectedElements = [ null, null ];
  }
});
