const app = {

  init: function () {
    // init labels
    labels.init();

    // init router
    router.init();

    // load page
    router.changePage(window.location.hash);
  },

  keyPressListener: function (event) {
    // when 'Enter' is pressed execute the route handler (if implemented)
    if (event.keyCode === 13) {
      const route = router.getCurrent();
      const handler = route.handler;
      if (typeof handler.enterKeyListener == 'function') {
        handler.enterKeyListener(event);
        util.preventEvent(event);
      }
    }
  }

};

// bind main events
window.onload = function () {
  app.init();
};

window.onkeypress = function (event) {
  app.keyPressListener(event);
};
