import { terms } from './terms.js';
import { mainEl, inputTermsEl, practiceSetupEl, practiceTermsEl } from './elements.js';

mainEl.append(inputTermsEl, practiceSetupEl, practiceTermsEl);

// Test data
for (let i = 0; i < 5; ++i) {
  terms.addTerm(
    String.fromCharCode('a'.charCodeAt(0) + i),
    String.fromCharCode('A'.charCodeAt(0) + i)
  );
}
