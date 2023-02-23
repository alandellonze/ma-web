function Route(name, htmlName, handler) {
  this.constructor(name, htmlName, handler);
}

Route.prototype = {

  name: undefined,
  htmlName: undefined,
  handler: undefined,
  init: undefined,

  constructor: function (name, htmlName, handler) {
    this.name = name;
    this.htmlName = htmlName;
    this.handler = handler;
  },

  isActiveRoute: function (hashedPath) {
    return hashedPath.replace('#', '') === this.name;
  }

};
