import { terms } from '../service/terms.js';
import TermsListComponent from './terms/list.js';
import Component from '../util/component.js';
import { importCsv } from '../util/csv.js';
import { filePrompt } from '../util/file.js';
import { ListMapCache } from '../util/list-map-cache.js';

const termColumn = 0;
const matchColumn = 1;

export default Component.define

`<div class="input-terms pane pane--menu">
  <div class="content">
    <div class="input-terms-lists"></div>
  </div>
  <nav class="secondary">
    <ul>
      <li class="import" data-action="import-list">Import List</li>
      <li data-action="add-list" class="disabled">Add List</li>
    </ul>
  </nav>
</div>`

(class extends Component {
  termsListsMap = new ListMapCache();

  constructor(element) {
    super(element);

    const lists = this.element.querySelector('.input-terms-lists');

    this.termsListsMap
      .setList([ { id: 1 } ])
      .setKey('id')
      .setCreate(() => TermsListComponent())
      .setBeforeUpdate(() => lists.innerHTML = '')
      .setUpdate(cmp => {
        cmp.setList(terms.terms);
        lists.append(cmp.element);
      })
    ;

    terms.on('change', () => this.termsListsMap.updateMap());

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
  }
});
