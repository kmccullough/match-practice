export function isWeakKey(key) {
  return key && (
    typeof key === 'object'
    || typeof key === 'function'
    || typeof key === 'symbol'
  );
}

export function get(object, keyPath) {
  if (!keyPath) {
    return;
  }
  for (const key of String(keyPath).split('.')) {
    if (!isWeakKey(object)) {
      return;
    }
    object = object[key];
  }
  return object;
}
