function Route(name, htmlName, handler) {
  this._constructor(name, htmlName, handler);
}

Route.prototype = {

  name: undefined,
  htmlName: undefined,
  handler: undefined,
  init: undefined,

  _constructor(name, htmlName, handler) {
    this.name = name;
    this.htmlName = htmlName;
    this.handler = handler;
  },

  isActiveRoute(hashedPath) {
    return hashedPath.replace('#', '') === this.name;
  }

};
