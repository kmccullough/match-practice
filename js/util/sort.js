import { get } from './object.js';

export function byKey(keyPath) {
  const sortByDefault = byDefault();
  return (a, b) => sortByDefault(get(a, keyPath), get(b, keyPath));
}

export function byObjectKey(...objects) {
  const oa = objects[0];
  const ob = objects[objects.length - 1];
  const sortByDefault = byDefault();
  return (a, b) => sortByDefault(get(oa, a), get(ob, b));
}

export function byDefault() {
  return (a, b) => {
    if (a?.toLowerCase) {
      a = a.toLowerCase();
    }
    if (b?.toLowerCase) {
      b = b.toLowerCase();
    }
    return a < b ? -1 : b < a ? 1 : 0;
  };
}
