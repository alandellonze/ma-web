const app = {

  init() {
    // init labels
    labels.init();

    // init router
    router.init();

    // load page
    router.changePage(window.location.hash);
  },

  keyPressListener(event) {
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

window.onkeyup = function (event) {
  app.keyPressListener(event);
};
