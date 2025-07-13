import Component from '../../component.js';

export default Component.define

`<div class="input-term-row">
  <div class="input-term">
    <label>
      <span class="label">Term</span>
      <input type="text">
    </label>
  </div>
  <div class="input-match">
    <label>
      <span class="label">Match</span>
      <input type="text">
    </label>
  </div>
  <span class="input-term-row-delete">&#10006;<span>
</div>`

(class extends Component {
  constructor(element) {
    super(element);

    element.querySelector('.input-term-row-delete').addEventListener('click', () => {

    });
  }

  setTerm(term) {
    this.element.querySelector('.input-term input')
      .value = term;
    return this;
  }

  setMatch(match) {
    this.element.querySelector('.input-match input')
      .value = match;
    return this;
  }
});
