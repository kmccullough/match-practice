import Component from '../component.js';
import { terms } from '../terms.js';
import { escapeRegExp } from '../regex.js';

const regex = '[,](?=(?:(?:[^"]*"){2})*[^"]*$)';
const delimiter = ';,';
const termColumn = 0;
const matchColumn = 1;

export default Component.define

`<div class="input-terms">
  <button class="import">Import</button>
</div>`

(class extends Component {
  constructor(element) {
    super(element);
    element.querySelector('.import').addEventListener('click', () => {
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
              terms.addTerm(columns[termColumn], columns[matchColumn]);
            }
          };
        }
      };
      input.click();
    });
  }
});
