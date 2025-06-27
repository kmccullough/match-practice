import { inputTermsEl } from './tpl/input-terms.js';
import { practiceSetupEl } from './tpl/practice-setup.js';
import { practiceTermsEl } from './tpl/practice-terms.js';

export { inputTermsEl } from './tpl/input-terms.js';
export { practiceSetupEl } from './tpl/practice-setup.js';
export { practiceTermsEl } from './tpl/practice-terms.js';

export const mainEl = document.querySelector('main');

mainEl.append(inputTermsEl, practiceSetupEl, practiceTermsEl);
