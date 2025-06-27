export function elementFromHtml(html) {
  const fragment = document.createElement('div');
  fragment.innerHTML = html;
  return fragment.firstChild;
}

export function factoryFromHtml(html) {
  let el;
  return () => {
    el ??= elementFromHtml(html);
    return el.cloneNode(true);
  };
}
