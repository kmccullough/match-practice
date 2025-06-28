import Component from '../component.js';
import { select } from '../element.js';
import { practice } from '../practice.js';
import PracticeTermsRowComponent from './practice-terms/row.js';
import PracticeTermComponent from './practice-terms/row/term.js';
import { practiceTermsEl } from '../elements.js';
import { terms } from '../terms.js';

export default Component.define

`<div class="terms terms-list"></div>`

(class extends Component {
  constructor(element) {
    super(element);

    const termListEl = select('.terms-list', element);

    practice.on('start', () => {
      termListEl.innerText = '';
      const roundCount = 6;
      const termCount = 5;
      const count = roundCount * termCount;

      // Pick random term pairs
      const randomTerms = [];
      const randomMatches = [];
      const matches = [];
      for (let i = 0; i < count; ++i) {
        const term = terms.getRandom();
        randomTerms.push(term.term);
        matches.push(term.match);
      }

      // Mix up matches
      for (let i = 0; i < count; ++i) {
        randomMatches.push(matches.splice(Math.floor(Math.random() * matches.length), 1)[0]);
      }

      // Render term elements
      for (let i = 0; i < termCount; ++i) {
        const termRowCmp = PracticeTermsRowComponent();
        const termRowEl = termRowCmp.element;
        const termCmp = PracticeTermComponent();
        const termEl = termCmp.element;
        termEl.innerText = randomTerms[i];
        const matchCmp = PracticeTermComponent();
        const matchEl = matchCmp.element;
        matchEl.innerText = randomMatches[i];
        termRowEl.append(termEl, matchEl);
        practiceTermsEl.append(termRowEl);
      }
    });
  }
});
