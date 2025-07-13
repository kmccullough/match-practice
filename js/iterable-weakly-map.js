import { isWeakKey } from './object.js';

export class IterableWeaklyMap {
  items = new Map;
  weakKeys = new WeakMap;

  constructor(iterable = []) {
    for (const [ key, value ] of iterable) {
      this.set(key, value);
    }
  }

  clear() {
    this.items = new Map;
    this.weakKeys = new WeakMap;
  }

  delete(key) {
    const isWeak = isWeakKey(key);
    let itemKey = key;
    if (isWeak) {
      if (!this.weakKeys.has(key)) {
        return false;
      }
      itemKey = this.weakKeys.get(key);
      this.weakKeys.delete(key);
    }
    return this.items.delete(itemKey);
  }

  get(key) {
    const isWeak = isWeakKey(key);
    let itemKey = key;
    if (isWeak) {
      if (!this.weakKeys.has(key)) {
        return undefined;
      }
      itemKey = this.weakKeys.get(key);
    }
    return this.items.get(itemKey);
  }

  has(key) {
    return isWeakKey(key) ? this.weakKeys.has(key) : this.items.has(key);
  }

  set(key, value) {
    const isWeak = isWeakKey(key);
    let itemKey = key;
    if (isWeak) {
      if (this.weakKeys.has(key)) {
        itemKey = this.weakKeys.get(key);
      } else {
        itemKey = new WeakRef(key);
        this.weakKeys.set(key, itemKey);
      }
    }
    this.items.set(itemKey, value);
  }

  entries() {
    return this[Symbol.iterator]();
  }

  *keys() {
    for (const key of this.items.keys()) {
      yield key instanceof WeakRef ? key.deref() : key;
    }
  }

  values() {
    return this.items.values();
  }

  *[Symbol.iterator]() {
    for (const [ key, value ] of this.items) {
      yield [ key instanceof WeakRef ? key.deref() : key, value ];
    }
  }

  forEach(callbackFn, thisArg = this) {
    for (const [ key, value ] of this.items) {
      callbackFn.call(thisArg, [ key instanceof WeakRef ? key.deref() : key, value ]);
    }
  }
}
