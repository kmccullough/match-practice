import { mod } from './math.js';

export function shuffle(array, start = 0, end = array.length) {
  start ??= 0;
  end ??= array.length;
  if (end < 0) {
    end = mod(array.length);
  }
  for (let i = end - 1; i > start; --i) {
    const j = Math.floor(Math.random() * (i + 1));
    [ array[i], array[j] ] = [ array[j], array[i] ];
  }
  return array;
}
