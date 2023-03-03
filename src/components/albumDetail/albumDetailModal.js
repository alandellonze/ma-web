function AlbumDetailModal() {
  Modal.call(this, AlbumDetail, '/components/albumDetail/albumDetail.html');
}

AlbumDetailModal.prototype = Object.create(Modal.prototype);
