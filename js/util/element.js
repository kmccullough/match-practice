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
 * @param {ElementsSelectors} selectors
 * @param {ElementsContexts} contexts
 * @return {HTMLElement|null}
 */
export function select(selectors, contexts = document.body) {
  return selectAll(selectors, contexts, 1)[0] ?? null;
}

/**
 * @param {ElementsSelectors} selectors
 * @param {ElementsContexts} contexts
 * @param {number} max
 * @return {HTMLElement[]}
 */
export function selectAll(selectors, contexts = document.body, max = Infinity) {
  contexts = Array.isArray(contexts) ? contexts : [ contexts ];
  selectors = Array.isArray(selectors) ? selectors : [ selectors ];
  let results = new Set;
  for (let s = 0; s < selectors.length && results.size < max; ++s) {
    let selector = selectors[s];
    if (!selector) {
      continue;
    }
    if (typeof selectors[s] === 'function') {
      results.push(...selectAll(selector(), contexts, max - results.size));
    } else if (selector instanceof HTMLElement) {
      results.add(selector);
    } else {
      for (let c = 0; c < contexts.length && results.size < max; ++c) {
        const context = contexts[c];
        if (!context) {
          continue;
        }
        if (max - results.size === 1) {
          if (context.matches(selector)) {
            results.add(context);
          } else {
            const match = context.querySelector(selector);
            if (match) {
              results.add(match);
            }
          }
        } else {
          if (context.matches(selector)) {
            results.add(context);
          }
          for (const el of context.querySelectorAll(selector)) {
            results.add(el);
          }
        }
      }
    }
  }
  results = Array.from(results);
  return results.length <= max ? results : results.slice(0, max);
}
