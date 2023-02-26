const ApiService = {

  getBands(name) {
    return ApiUtil.getAsync('/bands?name=' + name);
  },

  getDiff(bandId) {
    return ApiUtil.getAsync('/diff/' + bandId);
  }

};
