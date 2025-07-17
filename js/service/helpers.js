import { selectAll } from '../util/element.js';

export const helpers = new class HelpersService {
  helpers = [];

  /**
   * @param {ElementsSelectors} selector
   * @param {function(HTMLElement)} helper
   * @return {this}
   */
  register(selector, helper) {
    this.helpers.push({ selector, helper });
    return this;
  }

  /**
   * @param {HTMLElement} context
   * @return {this}
   */
  apply(context = document.body) {
    for (const { selector, helper } of this.helpers) {
      for (const el of selectAll(selector, context)) {
        helper(el);
      }
    }
    return this;
  }
};
