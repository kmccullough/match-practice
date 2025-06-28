import { factoryFromHtml } from '../../element.js';

export const inputTermsRowFactory = factoryFromHtml(
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
</div>
`);
