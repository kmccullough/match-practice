export function elementFromHtml(html, init = null) {
  const fragment = document.createElement('div');
  fragment.innerHTML = html;
  const el = fragment.firstChild;
  init?.(el);
  return el;
}

export function factoryFromHtml(html, init = null) {
  let el;
  return () => {
    el ??= elementFromHtml(html);
    const clone = el.cloneNode(true);
    init?.(clone);
    return clone;
  };
}

export function removeElement(el) {
  try {
    el?.remove();
  } catch (e) {}
}

export function select(selector, context = document.body) {
  return !context ? null : context.matches?.(selector) ? context : context?.querySelector(selector);
}

export function selectAll(selector, context = document.body) {
  return !context ? [] : context.matches?.(selector) ? [ context ] : context?.querySelectorAll(selector);
}
