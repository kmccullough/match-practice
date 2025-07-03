import InputTermsComponent from './component/input-terms.js';
import PracticeSetupComponent from './component/practice-setup.js';
import PracticeTermsComponent from './component/practice-terms.js';

export const mainEl = document.querySelector('main');
export const termsComponent = InputTermsComponent();
export const plansComponent = PracticeSetupComponent();
export const practiceComponent = PracticeTermsComponent();

export const termsEl = termsComponent.element;
export const plansEl = plansComponent.element;
export const practiceEl = practiceComponent.element;
