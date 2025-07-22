import { Events } from '../util/events.js';
import { byKey, byObjectKey } from '../util/sort.js';
import { terms } from './terms.js';

export const plans = new class PlansService {
  plans = [];
  nextPlanId = 1;

  events = new Events().setContext(this)
    .setDebounce(true);
  on(event, callback) {
    return this.events.on(event, callback);
  }
  off(event, callback) {
    return this.events.off(event, callback);
  }

  getOrAddPlan(id = null) {
    return id && this.plans.find(plan => plan.id === id)
      || this.addPlan();
  }

  addPlan(name = null, selectedListIds = null) {
    const id = this.nextPlanId++;
    const all = selectedListIds === true;
    selectedListIds = Array.isArray(selectedListIds) ? selectedListIds : [];
    const plan = { id, selectedListIds };
    this.plans.push(plan);
    this.renamePlan(id, name);
    if (all) {
      this.selectAllTermLists(id, true);
    }
    return plan;
  }

  renamePlan(id, name = null) {
    if (name === null) {
      name = 'Untitled Plan ' + id;
    }
    this.getOrAddPlan(id).name = name;
    this.sortPlans();
  }

  deletePlan(id) {
    const isDeleted = !!this.plans.splice(this.plans.findIndex(plan => plan.id === id), 1).length;
    if (isDeleted) {
      this.events.emit('change');
    }
    return isDeleted;
  }

  sortPlans() {
    this.plans.sort(byKey('name'));
    this.events.emit('change');
  }

  selectTermList(planId, listId, selected = true) {
    if (!listId) {
      return;
    }
    const plan = this.getOrAddPlan(planId);
    const index = plan.selectedListIds.indexOf(listId);
    if (index >= 0) {
      if (selected) {
        return;
      }
      plan.selectedListIds.splice(index, 1);
    } else {
      plan.selectedListIds.push(listId);
      this.sortTermLists(planId);
    }
    this.events.emit('change');
  }

  selectAllTermLists(planId, selected = true) {
    const plan = this.getOrAddPlan(planId);
    if (!selected) {
      plan.selectedListIds = [];
    } else {
      plan.selectedListIds.push(...terms.lists.map(({ id }) => id));
      this.sortTermLists(planId);
    }
    this.events.emit('change');
  }

  sortTermLists(planId) {
    const plan = this.getOrAddPlan(planId);
    const listNames = {};
    for (const list of terms.lists) {
      listNames[list.id] = name;
    }
    plan.selectedListIds.sort(byObjectKey(listNames));
    this.events.emit('change');
  }
};
