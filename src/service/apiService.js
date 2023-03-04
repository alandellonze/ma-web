const ApiService = {

  getBands(name) {
    return ApiUtil.getAsync('/bands?name=' + name);
  },

  getDiff(bandId) {
    return ApiUtil.getAsync('/diff/' + bandId);
  },

  saveAlbum(album) {
    return ApiUtil.postAsync('/albums', album);
  },

  deleteAlbum(bandId, albumId) {
    return ApiUtil.delAsync('/albums/' + bandId + '/' + albumId);
  },

  getMP3(albumId) {
    return ApiUtil.getAsync('/mp3s/' + albumId);
  },

  buildCoverPath(cover) {
    return ApiUtil._apiLocation + '/covers/' + cover;
  }

};
