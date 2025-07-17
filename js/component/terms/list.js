import TermsRowComponent from './list/row.js';
import Component from '../../util/component.js';
import { ListMapCache } from '../../util/list-map-cache.js';

export default Component.define

`<div class="input-terms-list">
  <div class="expands-heading heading" aria-expanded="true">
    <span class="expands-icon">&#9660;</span>
    <div>
      Example Terms
    </div>
    <span class="input-terms-list-delete disabled">&#10006;<span>
  </div>
  <div class="expands-body">
    <div class="input-terms-list-list"></div>
    <div class="actions tertiary-nav">
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
    const body = element.querySelector('.expands-body');

    this.termsListMap
      .setKey('id')
      .setCreate(() => TermsRowComponent())
      .setBeforeUpdate(() => list.innerHTML = '')
      .setUpdate((cmp, item) => {
        cmp.setTerm(item.term).setMatch(item.match);
        list.append(cmp.element);
      })
    ;

    element.querySelector('.expands-heading').addEventListener('click', ({ currentTarget }) => {
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

    element.querySelector('.input-terms-list-delete').addEventListener('click', () => {

    });
  }

  setList(list) {
    this.termsListMap.setList(list).updateMap();
    return this;
  }
});
