import PlanComponent from './plans/plan.js';
import { plans } from '../service/plans.js';
import Component from '../util/component.js';
import { ListMapCache } from '../util/list-map-cache.js';

export default Component.define

`<div class="pane pane--menu">
  <div class="content">
    <div class="plans-list"></div>
  </div>
  <nav class="secondary">
    <ul>
      <li data-action="add-plan">Add Plan</li>
    </ul>
  </nav>
</div>`

(class extends Component {
  plansListMap = new ListMapCache();

  constructor(element) {
    super(element);

    const plansList = this.element.querySelector('.plans-list');

    this.plansListMap
      .setList(plans.plans)
      .setKey('id')
      .setCreate(item => {
        const cmp = PlanComponent();
        cmp.on('selected', (isSelected, listId) =>
          plans.selectTermList(item.id, listId, isSelected)
        );
        cmp.on('delete', () => plans.deletePlan(item.id));
        return cmp;
      })
      .setBeforeUpdate(() => plansList.innerHTML = '')
      .setUpdate((cmp, item) => {
        cmp
          .setPlanId(item.id)
          .setName(item.name)
          .setSelectedListIds(item.selectedListIds)
        ;
        plansList.append(cmp.element);
      })
    ;

    plans.on('change', () => {
      this.plansListMap.updateMap();
    });

    element.querySelector('[data-action="add-plan"]')
      .addEventListener('click', () => {
        plans.addPlan();
      });
  }
});
