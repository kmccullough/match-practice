import { get } from './object.js';
import { IterableWeaklyMap } from './iterable-weakly-map.js';

const isSet = value => value !== null && value !== undefined;

export class ListMapCache {
  keyMap = new IterableWeaklyMap;
  map = [];

  constructor(options) {
    this
      .setList(options?.list)
      .setKey(options?.key)
      .setCreate(options?.create)
      .setUpdate(options?.update)
    ;
  }

  setList(list) {
    this.list = list;
    return this;
  }

  setKey(key) {
    this.key = key;
    return this;
  }

  setCreate(create) {
    this.create = create;
    return this;
  }

  setBeforeUpdate(beforeUpdate) {
    this.beforeUpdate = beforeUpdate;
    return this;
  }

  setUpdate(update) {
    this.update = update;
    return this;
  }

  updateMap() {
    this.map = [];
    let { beforeUpdate, create, key, keyMap, list, map, update } = this;
    if (typeof key == 'function') {
      key = key(this);
    }
    if (typeof list == 'function') {
      list = list(this);
    }
    const remainingKeys = new Set(this.keyMap.keys());
    beforeUpdate(this);
    for (const item of list) {
      let itemKey = key ? get(item, key) : item;
      let mapped = item;
      if (isSet(itemKey)) {
        if (remainingKeys.has(itemKey)) {
          mapped = keyMap.get(itemKey);
          remainingKeys.delete(itemKey);
        } else if (!keyMap.has(itemKey)) {
          mapped = create(item, itemKey, this);
          keyMap.set(itemKey, mapped);
        } else {
          itemKey = undefined;
        }
      }
      if (!isSet(itemKey)) {
        mapped = create(item, itemKey, this);
      }
      update(mapped, item, key, this);
      map.push({ key: itemKey, item, map: mapped });
    }
    for (const key of remainingKeys) {
      keyMap.delete(key);
    }
  }
}
