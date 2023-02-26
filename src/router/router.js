const router = {

  _rootEl: undefined,
  _routes: undefined,
  _default: undefined,
  _current: undefined,

  getCurrent() {
    return this._current;
  },

  init() {
    this._rootEl = util.id('app');
    this._routes = this._initRoutes();
    this._default = this._routes[0];
  },

  _initRoutes() {
    return [
      new Route('home', '/views/home/home.html', Home)
    ];
  },

  changePage(hash, initData) {
    if (!hash) {
      hash = this._default.name;
    }

    const cleanHash = hash.split("?")[0];
    let route = this._getRouteByHash(cleanHash);

    if (!route) {
      route = this._default;
      window.location.hash = this._default.name;
    } else {
      window.location.hash = hash;
    }

    this._goToRoute(route, initData);
  },

  _getRouteByHash(hash) {
    if (this._routes) {
      for (let i = 0; i < this._routes.length; i++) {
        if (this._routes[i].isActiveRoute(hash)) {
          return this._routes[i];
        }
      }
    }
    return null;
  },

  _goToRoute(route, initData) {
    this._current = route;

    // get html content for the given route
    this._rootEl.innerHTML = htmlStore.get(route.htmlName);

    // change page title
    document.title = labels.translate(route.name + 'Title');

    // fill the new html content
    route.handler.init(initData);

    // insert label translations for labeled elements in page
    labels.translateLabelsInPage();
  }

};
