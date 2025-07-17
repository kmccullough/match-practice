import PlanTermComponent from './plan/term.js';
import { practice } from '../../service/practice.js';
import Component from '../../util/component.js';
import { ListMapCache } from '../../util/list-map-cache.js';

export default Component.define

`<div class="plan">
  <div class="expands-heading heading" aria-expanded="true">
    <span class="expands-icon">&#9660;</span>
    <div class="plan-title">
      Practice All
    </div>
    <span class="plan-delete disabled">&#10006;<span>
  </div>
  <div class="expands-body">
    <fieldset>
      <legend>Terms</legend>
      <div class="plan-terms"></div>
    </fieldset>
    <div class="actions tertiary-nav">
      <button class="plan-start">Start</button>
    </div>
  </div>
</div>`

(class extends Component {
  termsListMap = new ListMapCache();

  constructor(element) {
    super(element);

    const terms = element.querySelector('.plan-terms');
    const body = element.querySelector('.expands-body');
    const start = element.querySelector('.plan-start');

    const termList = [ { id: -1, name: 'All', selected: true } ];

    this.termsListMap
      .setList(termList)
      .setKey('id')
      .setCreate(() => {
        const cmp = PlanTermComponent();
        cmp.on('check', (isChecked, item) => {
          item.selected = isChecked;
          if (item.id === -1) {
            for (const term of termList) {
              term.selected = isChecked;
            }
            this.termsListMap.updateMap();
            start.disabled = !isChecked;
          } else {
            start.disabled = !termList.some(t => t.selected);
          }
        });
        return cmp;
      })
      .setBeforeUpdate(() => terms.innerHTML = '')
      .setUpdate((cmp, item) => {
        cmp.setTerm(item);
        terms.append(cmp.element);
      })
      .updateMap()
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

    element.querySelector('.plan-delete').addEventListener('click', () => {

    });

    start.addEventListener('click', () => {
      start.disabled = !termList.some(t => t.selected);
      if (start.disabled) {
        return;
      }
      practice.start();
    });
  }
});
