import { importer } from '../service/importer.js';
import { terms } from '../service/terms.js';
import TermsListComponent from './terms/list.js';
import Component from '../util/component.js';
import { ListMapCache } from '../util/list-map-cache.js';

export default Component.define

`<div class="input-terms pane pane--menu">
  <div class="content">
    <div class="input-terms-lists"></div>
  </div>
  <nav class="secondary">
    <ul>
      <li class="import" data-action="import-list">Import List</li>
      <li data-action="add-list">Add List</li>
    </ul>
  </nav>
</div>`

(class extends Component {
  termsListsMap = new ListMapCache();

  constructor(element) {
    super(element);

    const lists = this.element.querySelector('.input-terms-lists');

    this.termsListsMap
      .setList(terms.lists)
      .setKey('id')
      .setCreate(item => {
        const cmp = TermsListComponent()
        cmp.on('delete', () => terms.deleteList(item.id));
        cmp.on('delete-term', id => terms.deleteTerm(item.id, id));
        return cmp;
      })
      .setBeforeUpdate(() => lists.innerHTML = '')
      .setUpdate((cmp, item) => {
        cmp
          .setId(item.id)
          .setName(item.name)
          .setList(item.terms)
        ;
        lists.append(cmp.element);
      })
    ;

    terms.on('change', () => this.termsListsMap.updateMap());

    element.querySelector('[data-action="import-list"]')
      .addEventListener('click', async () => {
        const data = await importer.importFromFile();
        for (const list of data) {
          terms.addList(list.name, list.terms);
        }
      });

    element.querySelector('[data-action="add-list"]')
      .addEventListener('click', () => terms.addList());
  }
});
