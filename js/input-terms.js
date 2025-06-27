import { inputTermsEl, practiceTermsEl } from './elements.js';
import { escapeRegExp } from './regex.js';
import { inputTermsRowFactory } from './tpl/input-terms/row.js';
import { practiceTermsRowFactory } from './tpl/practice-terms/row.js';
import { practiceTermFactory } from './tpl/practice-terms/row/term.js';

const regex = '[,](?=(?:(?:[^"]*"){2})*[^"]*$)';
const delimiter = ';,';
const termColumn = 0;
const matchColumn = 1;

inputTermsEl.querySelector('.import').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = '*/*';
  input.onchange = (e) => {
    const { files } = e.target;
    for (let i = 0, len = files.length; i < len; ++i) {
      const file = files[i];
      const { name } = file;
      const reader = new FileReader();
      reader.readAsText(file, 'utf8');
      reader.onload = readerEvent => {
        console.log('Importing file: ', name);
        for (const line of readerEvent.target.result.split('\n')) {
          if (!line) {
            continue;
          }
          const columns = line.split(
            new RegExp(regex.replace(',', escapeRegExp(delimiter)))
          );
          addTerm(columns[termColumn], columns[matchColumn]);
        }
      };
    }
  };
  input.click();
});

export function addTerm(term, match) {
  const inputTermRowEl = inputTermsRowFactory();
  const inputTermEl =  inputTermRowEl.querySelector('.input-term input');
  const inputMatchEl =  inputTermRowEl.querySelector('.input-match input');
  inputTermEl.value = term;
  inputMatchEl.value = match;
  inputTermsEl.append(inputTermRowEl);

  const termRowEl = practiceTermsRowFactory();
  const termEl1 = practiceTermFactory();
  termEl1.innerText = term;
  const termEl2 = practiceTermFactory();
  termEl2.innerText = match;
  termRowEl.append(termEl1, termEl2);
  practiceTermsEl.append(termRowEl);
}
