import PlanComponent from './component/plans.js';
import PracticeComponent from './component/practice.js';
import TermsComponent from './component/terms.js';

export const mainEl = document.querySelector('main');
export const termsComponent = TermsComponent();
export const plansComponent = PlanComponent();
export const practiceComponent = PracticeComponent();

export const termsEl = termsComponent.element;
export const plansEl = plansComponent.element;
export const practiceEl = practiceComponent.element;
