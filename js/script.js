import { addTerm } from './input-terms.js';

// Test data
for (let i = 0; i < 5; ++i) {
  addTerm(
    String.fromCharCode('a'.charCodeAt(0) + i),
    String.fromCharCode('A'.charCodeAt(0) + i)
  );
}
