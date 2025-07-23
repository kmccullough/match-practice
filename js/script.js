import './helpers.js';

import { plansEl, practiceEl, termsEl } from './elements.js';
import { routes } from './routes.js';
import { helpers } from './service/helpers.js';
import { plans } from './service/plans.js';
import { terms } from './service/terms.js';

helpers.apply([ document.body, termsEl, plansEl, practiceEl ]);

// Test data
const testTerms = [];
for (let i = 0; i < 5; ++i) {
  testTerms.push({
    term: String.fromCharCode('a'.charCodeAt(0) + i),
    match: String.fromCharCode('A'.charCodeAt(0) + i),
    weight: 1,
  });
}
terms.addList('Example Terms', testTerms);
plans.addPlan('Practice All', true);

routes.transitionTo('terms');
