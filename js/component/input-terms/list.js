import Component from '../../component.js';
import { ListMapCache } from '../../list-map-cache.js';
import InputTermsRowComponent from './list/row.js';

export default Component.define

`<div class="input-terms-list">
  <div class="input-terms-heading" aria-expanded="true">
    <span class="input-terms-list-expand-icon">&#9660;</span>
    <div class="input-terms-title">
      Example Terms
    </div>
    <span class="input-terms-list-delete disabled">&#10006;<span>
  </div>
  <div class="input-terms-list-body">
    <div class="input-terms-list-list"></div>
    <div class="input-terms-list-actions">
      <button class="input-terms-list-import-terms">Import Terms</button>
      <button class="input-terms-list-add-term">Add Term</button>
    </div>
  </div>
</div>`

(class extends Component {
  termsListMap = new ListMapCache();

  constructor(element) {
    super(element);

    const list = element.querySelector('.input-terms-list-list');
    const body = element.querySelector('.input-terms-list-body');

    this.termsListMap
      .setKey('id')
      .setCreate(() => InputTermsRowComponent())
      .setBeforeUpdate(() => list.innerHTML = '')
      .setUpdate((cmp, item) => {
        cmp.setTerm(item.term).setMatch(item.match);
        list.append(cmp.element);
      })
    ;

    element.querySelector('.input-terms-heading').addEventListener('click', ({ currentTarget }) => {
      const icon = currentTarget.querySelector('.input-terms-list-expand-icon');
      const isExpanded = currentTarget.getAttribute('aria-expanded') !== 'true';
      currentTarget.setAttribute('aria-expanded', isExpanded);
      icon.innerHTML = isExpanded ? '&#9660;' : '&#9658;';
      if (isExpanded) {
        body.style.display = '';
      } else {
        body.style.display = 'none';
      }
    });

    element.querySelector('.input-terms-list-delete').addEventListener('click', () => {

    });
  }

  setList(list) {
    this.termsListMap.setList(list).updateMap();
    return this;
  }
});
