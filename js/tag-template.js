export function expr(strings, ...values) {
  const result = [ strings[0] ];
  for (let i = 0; i < values.length; ++i) {
    result.push(values[i], strings[i + 1]);
  }
  return result.join('');
}
