import Component from '../component.js';
import { practice } from '../practice.js';

export default Component.define

`<div class="practice-setup">
  <button class="start">Start</button>
</div>`

(class extends Component {
  constructor(element) {
    super(element);
    element.querySelector('.start').addEventListener('click', () => {
      practice.start();
    });
  }
});
