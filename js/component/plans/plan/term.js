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
  constructor(element) {
    super(element);

    element.querySelector('input').addEventListener('click', e => {
      this.events.emit('check', e.target.checked);
    });
  }

  setName(name) {
    this.element.querySelector('.label').innerText = name;
    return this;
  }

  setChecked(checked) {
    this.element.querySelector('input').checked = checked;
    return this;
  }

  setEmpty(isEmpty) {
    this.element.querySelector('.label').classList.toggle('empty', isEmpty);
    return this;
  }
});
