const ApiService = {

  getBands(name) {
    return ApiUtil.getAsync('/bands?name=' + name);
  },

  getDiff(bandId) {
    return ApiUtil.getAsync('/diff/' + bandId);
  },

  async saveAlbum(album) {
    return ApiUtil.postAsync('/albums', album);
  },

  async deleteAlbum(bandId, albumId) {
    return ApiUtil.delAsync('/albums/' + bandId + '/' + albumId);
  }

};
