import { routes } from '../service/routes.js';

const links = [];

routes.on('enter-route', routeName => {
  for (const link of links) {
    setLinkToClasses(link.deref());
  }
});

function setLinkToClasses(element) {
  if (!element) {
    return;
  }
  if (routes.isActive(element.dataset.linkTo)) {
    element.classList.add('active-route');
  } else {
    element.classList.remove('active-route');
  }
}

export function linkTo(element) {
  links.push(new WeakRef(element));
  element.addEventListener('click', ({ currentTarget }) =>
    routes.transitionTo(currentTarget.dataset.linkTo)
  );
}
