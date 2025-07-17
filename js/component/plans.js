import PlanComponent from './plans/plan.js';
import Component from '../util/component.js';
import { ListMapCache } from '../util/list-map-cache.js';

export default Component.define

`<div class="pane pane--menu">
  <div class="content">
    <div class="plans-list"></div>
  </div>
  <nav class="secondary">
    <ul>
      <li data-action="add-plan" class="disabled">Add Plan</li>
    </ul>
  </nav>
</div>`

(class extends Component {
  plansListMap = new ListMapCache();

  constructor(element) {
    super(element);

    const plans = this.element.querySelector('.plans-list');

    this.plansListMap
      .setList([ { id: 1 } ])
      .setKey('id')
      .setCreate(() => PlanComponent())
      .setBeforeUpdate(() => plans.innerHTML = '')
      .setUpdate(cmp => {
        plans.append(cmp.element);
      })
      .updateMap()
    ;
  }
});
