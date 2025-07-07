import Component from '../component.js';
import { terms } from '../terms.js';
import { escapeRegExp } from '../regex.js';

const regex = '[,](?=(?:(?:[^"]*"){2})*[^"]*$)';
const delimiter = ';,';
const termColumn = 0;
const matchColumn = 1;

export default Component.define

`<div class="input-terms">
  <div class="input-terms-content content">
    <div class="input-terms-lists">
      <div class="input-terms-list">
        <div class="input-terms-heading" aria-expanded="true">
          <span class="input-terms-list-expand-icon">&#9660;</span>
          <div class="input-terms-title">
            Example Terms
          </div>
          <span class="input-terms-list-delete disabled">&#10006;<span>
        </div>
        <div class="input-terms-list-list">
        
        </div>
      </div>
    </div>
  </div>
  <nav>
    <ul>
      <li class="import" data-action="import-list">Import List</li>
      <li data-action="add-list" class="disabled">Add List</li>
    </ul>
  </nav>
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

    element.querySelector('.input-terms-heading').addEventListener('click', ({ currentTarget }) => {
      const icon = currentTarget.querySelector('.input-terms-list-expand-icon');
      const list = element.querySelector('.input-terms-list-list');
      const isExpanded = currentTarget.getAttribute('aria-expanded') !== 'true';
      currentTarget.setAttribute('aria-expanded', isExpanded);
      icon.innerHTML = isExpanded ? '&#9660;' : '&#9658;';
      if (isExpanded) {
        list.style.display = '';
      } else {
        list.style.display = 'none';
      }
    });

    element.querySelector('.input-terms-list-delete').addEventListener('click', () => {

    });
  }
});
