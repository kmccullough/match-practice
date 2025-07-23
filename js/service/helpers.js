import { selectAll } from '../util/element.js';

export const helpers = new class HelpersService {
  helpers = [];

  /**
   * @param {ElementsSelectors} selector
   * @param {function(HTMLElement)} helper
   * @return {this}
   */
  register(selector, helper) {
    if (this.applied) {
      throw new Error('Cannot register helpers; already applied!')
    }
    this.helpers.push({ selector, helper });
    return this;
  }

  /**
   * @param {HTMLElement} context
   * @return {this}
   */
  apply(context = document.body) {
    this.applied ??= new WeakMap;
    for (const { selector, helper } of this.helpers) {
      for (const el of selectAll(selector, { context })) {
        const applied = this.applied.get(el) ?? [];
        if (!applied.includes(helper)) {
          applied.push(helper);
          this.applied.set(el, applied);
          helper(el);
        }
      }
    }
    return this;
  }
};
