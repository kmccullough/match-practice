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

/**
 * @typedef {function():ElementsSelectorsPlainArray} ElementsSelectorFunction
 */
/**
 * @typedef {HTMLElement|string|null|undefined} ElementsSelectorPlain
 */
/**
 * @typedef {ElementsSelectorPlain|ElementsSelectorFunction} ElementsSelectosrOrFunction
 */
/**
 * @typedef {ElementsSelectorPlain|ElementsSelectorPlain[]} ElementsSelectorsPlainArray
 */
/**
 * @typedef {ElementsSelectosrOrFunction|ElementsSelectosrOrFunction[]} ElementsSelectors
 */
/**
 * @typedef {HTMLElement} ElementsContextPlain
 */
/**
 * @typedef {ElementsContextPlain|ElementsContextPlain[]} ElementsContexts
 */

/**
 * @typedef SelectOptions
 * @property {ElementsContexts} [context]
 * @property {ElementsSelectors} [ignoreChildren]
 * @property {ElementsSelectors} [ignoreNode]
 * @property {ElementsSelectors} [ignoreTree]
 * @return {HTMLElement[]}
 */
/**
 * @param {ElementsSelectors} selectors
 * @param {SelectAllOptions} [options]
 * @return {HTMLElement|null}
 */
export function select(selectors, options = {}) {
  return selectAll(selectors, { ...options, max: 1 })[0] ?? null;
}

/**
 * @typedef SelectAllSpecificOptions
 * @property {number} [max]
 */
/**
 * @typedef {SelectOptions|SelectAllSpecificOptions} SelectAllOptions
 */
/**
 * @param {ElementsSelectors} selectors
 * @param {SelectAllOptions} [options]
 * @return {HTMLElement[]}
 */
export function selectAll(selectors, options = {}) {
  const {
    max = Infinity,
    ignoreChildren, ignoreNode, ignoreTree,
  } = options;
  let {
    context: contexts = document.body,
  } = options;
  const opts = { context: contexts };
  const ignoredTreeNodes = !ignoreTree ? []
    : selectAll(ignoreTree, opts);
  const ignoredNodes = [
    ...(!ignoreNode ? [] : selectAll(ignoreNode, opts)),
    ...ignoredTreeNodes,
  ];
  const ignoredChildren = [
    ...(!ignoreChildren ? [] : selectAll(ignoreChildren, opts)),
    ...ignoredTreeNodes,
  ];
  contexts = Array.isArray(contexts) ? contexts : [ contexts ];
  selectors = Array.isArray(selectors) ? selectors : [ selectors ];
  let results = new Set;
  for (let s = 0; s < selectors.length && results.size < max; ++s) {
    let selector = selectors[s];
    if (!selector) {
      continue;
    }
    const potentials = [];
    if (typeof selector === 'function') {
      potentials.push(...selectAll(selector(), { ...opts, max: max - results.size }));
    } else if (selector instanceof HTMLElement) {
      potentials.push(selector);
    } else {
      for (let c = 0; c < contexts.length && results.size < max; ++c) {
        const context = contexts[c];
        if (!context) {
          continue;
        }
        if (max - results.size === 1) {
          if (context.matches(selector)) {
            potentials.push(context);
          } else {
            const match = context.querySelector(selector);
            if (match) {
              potentials.push(match);
            }
          }
        } else {
          if (context.matches(selector)) {
            potentials.push(context);
          }
          for (const el of context.querySelectorAll(selector)) {
            potentials.push(el);
          }
        }
        for (const potential of potentials) {
          if (!ignoredNodes.includes(potential)
            && !ignoredChildren.some(el => el.contains(potential))
          ) {
            results.add(potential);
          }
        }
      }
    }
  }
  results = Array.from(results);
  return results.length <= max ? results : results.slice(0, max);
}
