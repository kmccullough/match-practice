import InputTermsComponent from './component/input-terms.js';
import PracticeSetupComponent from './component/practice-setup.js';
import PracticeTermsComponent from './component/practice-terms.js';

export const mainEl = document.querySelector('main');
export const inputTermsComponent = InputTermsComponent();
export const practiceSetupComponent = PracticeSetupComponent();
export const practiceTermsComponent = PracticeTermsComponent();

export const inputTermsEl = inputTermsComponent.element;
export const practiceSetupEl = practiceSetupComponent.element;
export const practiceTermsEl = practiceTermsComponent.element;
