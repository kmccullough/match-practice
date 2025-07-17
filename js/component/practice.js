import PracticeRowComponent from './practice/row.js';
import PracticeTermComponent from './practice/row/term.js';
import { practice } from '../service/practice.js';
import { shuffle } from '../util/array.js';
import Component from '../util/component.js';
import { select } from '../util/element.js';

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
  correctElements;

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
    this.elementTermMap = new WeakMap;
    this.elementMatchMap = new WeakMap;
    this.incorrectElements = new WeakMap;
    this.correctElements = new WeakSet;

    this.termsListElement.innerText = '';

    const { termCountPerRound } = practice;
    for (let i = 0; i < termCountPerRound; ++i) {
      const termRowCmp = PracticeRowComponent();
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
    if (this.correctElements.has(element)) {
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
    const match = this.elementMatchMap.get(matchEl);
    const isMatch = practice.crossTermMatches.get(term.term).includes(match.match)
      || practice.crossMatchTerms.get(match.match).includes(term.term);
    const oldClass = isMatch ? 'incorrect' : 'correct';
    const newClass = isMatch ? 'correct' : 'incorrect';
    termEl.classList.remove(oldClass, 'selected');
    termEl.classList.add(newClass);
    matchEl.classList.remove(oldClass, 'selected');
    matchEl.classList.add(newClass);
    this.selectedElements = [ null, null ];
    if (isMatch) {
      this.setCorrectElements(termEl, matchEl);
    } else {
      this.setIncorrectElements(termEl, matchEl);
      this.incorrect = (this.incorrect ?? 0) + 1;
      ++practice.incorrectCount;
    }
  }

  setCorrectElements(...elements) {
    const { correctElements } = this;
    for (const el of elements) {
      correctElements.add(el);
    }
    const empties = [ this.emptyTermElements, this.emptyMatchElements ];
    setTimeout(() => {
      for (let i = 0; i < elements.length; ++i) {
        const el = elements[i];
        el.classList.remove('correct');
        el.classList.add('empty');
        correctElements.delete(el);
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
      incorrectElements.set(el,
        setTimeout(() => {
          el.classList.remove('incorrect');
        }, practice.incorrectDisplayTime)
      );
    }
  }
});
