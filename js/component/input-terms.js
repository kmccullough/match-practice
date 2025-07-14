import Component from '../component.js';
import { importCsv } from '../csv.js';
import { filePrompt } from '../file.js';
import { ListMapCache } from '../list-map-cache.js';
import InputTermsRowComponent from './input-terms/row.js';
import { terms } from '../service/terms.js';

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
        <div class="input-terms-list-list"></div>
        <div class="input-terms-list-actions">
          <button class="input-terms-list-import-terms">Import Terms</button>
          <button class="input-terms-list-add-term">Add Term</button>
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
  termsListMap = new ListMapCache();

  constructor(element) {
    super(element);

    this.termsListMap
      .setList(terms.terms)
      .setKey('id')
      .setCreate(() => InputTermsRowComponent())
      .setUpdate((cmp, item) => {
        cmp.setTerm(item.term).setMatch(item.match);
      })
    ;

    terms.on('change', () => {
      this.termsListMap.updateMap();
      const list = this.element.querySelector('.input-terms-list-list');
      list.innerHTML = '';
      for (const item of this.termsListMap.map) {
        list.append(item.map.element);
      }
    });

    element.querySelector('.import').addEventListener('click', () => {
      filePrompt({ read: files => {
        for (let i = 0, len = files.length; i < len; ++i) {
          const file = files[i];
          const { name } = file;
          const reader = new FileReader();
          reader.addEventListener('load', ({ target }) => {
            console.log('Importing file: ', name);
            const csv = importCsv({
              text: target.result,
            });
            for (const columns of csv) {
              if (columns.length < 2) {
                continue;
              }
              terms.addTerm(columns[termColumn], columns[matchColumn]);
            }
          });
          reader.readAsText(file, 'utf8');
        }
      } });
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
