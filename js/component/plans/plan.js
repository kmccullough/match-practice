import PlanTermComponent from './plan/term.js';
import { practice } from '../../service/practice.js';
import { terms } from '../../service/terms.js';
import Component from '../../util/component.js';
import { ListMapCache } from '../../util/list-map-cache.js';

export default Component.define

`<div class="plan content-item">
  <div class="expands-heading heading" aria-expanded="true">
    <span class="expands-icon">&#9660;</span>
    <div class="plan-title"></div>
    <span class="plan-delete disabled">&#10006;<span>
  </div>
  <div class="expands-body">
    <fieldset>
      <legend>Terms</legend>
      <div class="plan-terms"></div>
    </fieldset>
    <div class="actions tertiary-nav">
      <button data-action="plan-start" disabled>Start</button>
    </div>
  </div>
</div>`

(class extends Component {
  all = PlanTermComponent()
    .setName('All')
    .setChecked(false)
  ;
  selectedListIds = [];
  termsListMap = new ListMapCache();

  constructor(element) {
    super(element);

    const termsListEl = element.querySelector('.plan-terms');
    const body = element.querySelector('.expands-body');
    const start = this.startEl = element.querySelector('[data-action="plan-start"]');

    terms.on('change', () => this.termsListMap.updateMap());

    this.all.on('check', isChecked => {
      this.selectedListIds = [];
      if (isChecked) {
        for (const list of terms.lists) {
          this.selectedListIds.push(list.id);
        }
      }
      this.termsListMap.updateMap();
      this.events.emit('selected', isChecked, null);
    });

    this.termsListMap
      .setList(terms.lists)
      .setKey('id')
      .setCreate(item => {
        const cmp = PlanTermComponent();
        cmp.on('check', isChecked => {
          const index = this.selectedListIds.indexOf(item.id);
          if (!isChecked) {
            this.selectedListIds.splice(index, 1);
          } else if (index < 0) {
            this.selectedListIds.push(item.id);
          }
          this.termsListMap.updateMap();
          this.setEnabled();
          this.events.emit('selected', isChecked, item.id);
        });
        return cmp;
      })
      .setBeforeUpdate(() => {
        termsListEl.innerHTML = '';
        termsListEl.append(this.all.element);
        this.setEnabled();
      })
      .setUpdate((cmp, item) => {
        cmp
          .setName(item.name)
          .setChecked(this.selectedListIds.includes(item.id))
          .setEmpty(!item.terms.length)
        ;
        termsListEl.append(cmp.element);
      })
      .updateMap()
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

    element.querySelector('.plan-delete')
      .addEventListener('click', () => this.events.emit('delete'));

    start.addEventListener('click', () => {
      if (start.disabled) {
        return;
      }
      practice.start(this.planId);
    });
  }

  setEnabled() {
    let isDisabled = true;
    const { selectedListIds } = this;
    for (const list of terms.lists) {
      if (list.terms.length && selectedListIds.includes(list.id)) {
        isDisabled = false;
        break;
      }
    }
    this.startEl.disabled = isDisabled;
  }

  setPlanId(planId) {
    this.planId = planId;
    return this;
  }

  setName(name) {
    this.element.querySelector('.plan-title').innerText = name;
    return this;
  }

  setSelectedListIds(listIds) {
    this.selectedListIds = listIds;
    this.termsListMap.updateMap();
    return this;
  }
});
