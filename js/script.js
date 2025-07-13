import { plansEl, practiceEl, termsEl } from './elements.js';
import { linkTo } from './helper/link-to.js';
import { routes } from './routes.js';
import { helpers } from './service/helpers.js';
import { terms } from './service/terms.js';

helpers
  .register('[data-link-to]', linkTo)
  .apply([ document.body, termsEl, plansEl, practiceEl ])

// Test data
for (let i = 0; i < 5; ++i) {
  terms.addTerm(
    String.fromCharCode('a'.charCodeAt(0) + i),
    String.fromCharCode('A'.charCodeAt(0) + i)
  );
}

routes.transitionTo('terms');
