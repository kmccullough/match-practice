import { factoryFromHtml } from './element.js';
import { expr } from './tag-template.js';
import { Events } from './events.js';

export class Component {
  /**
   * @type {HTMLElement}
   */
  element;

  events = new Events().setContext(this)
    .setDebounce(true);
  on(event, callback) {
    return this.events.on(event, callback);
  }
  off(event, callback) {
    return this.events.off(event, callback);
  }

  constructor(element) {
    if (this._baseConstructed) {
      return;
    }
    this._baseConstructed = true;
    this.element = element;
  }
}

Component.define = component;

export default Component;

export function component(html, ...values) {
  const elementFactory = factoryFromHtml(expr(html, ...values));
  return (ComponentClass = null) => {
    if (!ComponentClass) {
      return new Component(elementFactory());
    }
    return () => {
      const element = elementFactory();
      return new ComponentClass(element);
    };
  };
}
