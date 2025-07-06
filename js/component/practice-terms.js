import { shuffle } from '../array.js';
import Component from '../component.js';
import { select } from '../element.js';
import { practice } from '../service/practice.js';
import PracticeTermsRowComponent from './practice-terms/row.js';
import PracticeTermComponent from './practice-terms/row/term.js';

export default Component.define

`<div class="terms content"><div class="terms-list"></div></div>`

(class extends Component {
  termsListElement;
  termElements;
  matchElements;
  emptyTermElements;
  emptyMatchElements;
  selectedElements;
  elementTermMap;
  elementMatchMap;
  incorrectElements;

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
    this.incorrectElements = new WeakMap();

    this.termsListElement.innerText = '';

    const { termCountPerRound } = practice;
    for (let i = 0; i < termCountPerRound; ++i) {
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
      this.termsListElement.append(termRowEl);
    }
  }

  fillTerms() {
    const { emptyMatchElements } = this;
    const count = emptyMatchElements.length;
    if (count < practice.termCountPerRound) {
      return;
    }
    shuffle(emptyMatchElements);
    const terms = practice.consumeTerms(count);
    const { emptyTermElements, elementTermMap, elementMatchMap } = this;
    for (let i = 0; i < terms.length; ++i) {
      const term = terms[i];
      const termEl = emptyTermElements.shift();
      termEl.innerText = term.term;
      termEl.classList.remove('empty');
      elementTermMap.set(termEl, term);
      const matchEl = emptyMatchElements.shift();
      matchEl.innerText = term.match;
      matchEl.classList.remove('empty');
      elementMatchMap.set(matchEl, term);
    }
  }

  selectElement(selectionIndex, element) {
    const term = (selectionIndex ? this.elementMatchMap : this.elementTermMap).get(element);
    if (term.correct) {
      return;
    }
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
    term.correct = isMatch;
    if (isMatch) {
      this.setCorrectElements(termEl, matchEl);
    } else {
      this.setIncorrectElements(termEl, matchEl);
      this.incorrect = (this.incorrect ?? 0) + 1;
      ++practice.incorrectCount;
    }
  }

  setCorrectElements(...elements) {
    setTimeout(() => {
      const empties = [ this.emptyTermElements, this.emptyMatchElements ];
      for (let i = 0; i < elements.length; ++i) {
        const el = elements[i];
        el.classList.remove('correct');
        el.classList.add('empty');
        empties[i].push(el);
      }
      this.fillTerms();
    }, practice.correctDisplayTime);
  }

  setIncorrectElements(...elements) {
    const { incorrectElements } = this;
    for (const el of elements) {
      if (incorrectElements.has(el)) {
        clearTimeout(incorrectElements.get(el));
        incorrectElements.delete(el);
      }
      this.incorrectElements.set(el,
        setTimeout(() => {
          el.classList.remove('incorrect');
        }, practice.incorrectDisplayTime)
      );
    }
  }
});
