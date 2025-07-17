import Component from '../../../util/component.js';
import { Events } from '../../../util/events.js';

export default Component.define

`<div class="plan-term">
  <label>
    <input type="checkbox">
    <span class="label"></span>
  </label>
</div>`

(class extends Component {
  events = new Events().setContext(this);
  on(event, callback) {
    return this.events.on(event, callback);
  }
  off(event, callback) {
    return this.events.off(event, callback);
  }

  constructor(element) {
    super(element);

    element.querySelector('input').addEventListener('click', e => {
      this.events.emit('check', e.target.checked, this.term);
    });
  }

  setTerm(term) {
    this.term = term;
    this.element.querySelector('.label').innerText = term.name;
    this.element.querySelector('input').checked = term.selected;
  }
});
