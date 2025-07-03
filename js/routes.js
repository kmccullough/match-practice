import { mainEl, plansEl, practiceEl, termsEl } from './elements.js';
import { routes } from './service/routes.js';

export { routes } from './service/routes.js';

export const routeEls = {
  terms: termsEl,
  plans: plansEl,
  practice: practiceEl,
};

let currentRoute;

routes.on('enter-route', routeName => {
  const routeEl = routeEls[routeName];
  if (!routeEl) {
    return;
  }
  if (currentRoute) {
    currentRoute.replaceWith(routeEl);
  } else {
    mainEl.append(routeEl);
  }
  currentRoute = routeEl;
});
