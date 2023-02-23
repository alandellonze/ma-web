const ApiService = {

  getBands: function (name) {
    return ApiUtil.getAsync('/bands?name=' + name);
  },

  getBand: function (id) {
    return ApiUtil.getAsync('/bands/' + id);
  }

};
