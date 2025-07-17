import { Events } from '../util/events.js';

export const routes = new class RoutesService {
  events = new Events().setContext(this);

  on(event, callback) {
    return this.events.on(event, callback);
  }

  off(event, callback) {
    return this.events.off(event, callback);
  }

  transitionTo(route) {
    const { currentRoute } = this;
    if (currentRoute && currentRoute === route) {
      return;
    }
    if (currentRoute) {
      this.events.emit('exit-route', currentRoute);
    }
    this.currentRoute = route;
    this.events.emit('enter-route', route);
  }

  isActive(route) {
    return this.currentRoute === route;
  }
};
