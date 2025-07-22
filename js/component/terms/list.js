import TermsRowComponent from './list/row.js';
import { importer } from '../../service/importer.js';
import { terms } from '../../service/terms.js';
import Component from '../../util/component.js';
import { ListMapCache } from '../../util/list-map-cache.js';

export default Component.define

`<div class="input-terms-list content-item">
  <div class="expands-heading heading" aria-expanded="true">
    <span class="expands-icon">&#9660;</span>
    <div class="list-name"></div>
    <span class="input-terms-list-delete disabled">&#10006;<span>
  </div>
  <div class="expands-body">
    <div class="input-terms-list-list"></div>
    <div class="actions tertiary-nav">
      <button data-action="import-terms">Import Terms</button>
      <button class="input-terms-list-add-term">Add Term</button>
    </div>
  </div>
</div>`

(class extends Component {
  termsListMap = new ListMapCache();

  constructor(element) {
    super(element);

    const list = element.querySelector('.input-terms-list-list');
    const body = element.querySelector('.expands-body');

    this.termsListMap
      .setKey('id')
      .setCreate(item => {
        const cmp = TermsRowComponent();
        cmp.on('delete', () => this.events.emit('delete-term', item.id));
        return cmp;
      })
      .setBeforeUpdate(() => list.innerHTML = '')
      .setUpdate((cmp, item) => {
        cmp.setTerm(item.term).setMatch(item.match);
        list.append(cmp.element);
      })
    ;

    element.querySelector('.expands-heading')
      .addEventListener('click', ({ currentTarget }) => {
        const icon = currentTarget.querySelector('.expands-icon');
        const isExpanded = currentTarget.getAttribute('aria-expanded') !== 'true';
        currentTarget.setAttribute('aria-expanded', isExpanded);
        icon.innerHTML = isExpanded ? '&#9660;' : '&#9658;';
        if (isExpanded) {
          body.style.display = '';
        } else {
          body.style.display = 'none';
        }
      });

    element.querySelector('[data-action="import-terms"]')
      .addEventListener('click', async () => {
        const data = await importer.importFromFile();
        for (const list of data) {
          terms.addTerms(this.id, list.terms);
        }
      });

    element.querySelector('.input-terms-list-delete')
      .addEventListener('click', () => this.events.emit('delete'));
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setName(name) {
    this.element.querySelector('.list-name').innerText = name;
    return this;
  }

  setList(list) {
    this.termsListMap.setList(list).updateMap();
    return this;
  }
});
