import { selectAll } from '../util/element.js';

export function expands(element) {
  const opts = {
    context: element,
    ignoreTree: ':scope [data-expands]',
  };
  const triggers = selectAll('[data-expands-head], [data-expands-button]', opts);
  const bodies = selectAll('[data-expands-body]', opts);
  const icons = selectAll('[data-expands-icon]', opts);
  const setExpanded = isExpanded => {
    element.setAttribute('aria-expanded', isExpanded);
    for (const icon of icons) {
      icon.innerHTML = isExpanded ? '&#9660;' : '&#9658;';
    }
    for (const body of bodies) {
      if (isExpanded) {
        body.style.display = '';
      } else {
        body.style.display = 'none';
      }
    }
  };
  setExpanded(element.getAttribute('aria-expanded') !== 'false');
  for (const trigger of triggers) {
    trigger.addEventListener('click', () =>
      setExpanded(element.getAttribute('aria-expanded') === 'false')
    );
  }
}
