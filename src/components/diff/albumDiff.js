function AlbumDiff(id) {
  this.id = id;
}

AlbumDiff.prototype = {

  DIFF_TYPE_MAP: {
    'EQUAL': '',
    'PLUS': '+',
    'MINUS': '-',
    'CHANGE': '<>'
  },

  STATUS_MAP: {
    'NONE': '?',
    'NOT_PRESENT': 'x',
    'PRESENT': 'v',
    'TMP': '-'
  },

  WARNING_MAP: {
    'NONE|PRESENT': 'NOT_PRESENT',
    'NOT_PRESENT|PRESENT': 'NOT_PRESENT'
  },

  id: null,

  update(delta) {
    let changes = delta.changes

    // create table
    const table = util.emptyTable(this.id);

    // create header
    const tr = util.tr(table);
    util.td(tr);
    util.td(tr);
    util.td(tr);
    util.td(tr);
    util.td(tr, changes + ' differences');
    util.td(tr);
    util.td(tr, 'DB');
    util.td(tr, 'MP3');
    util.td(tr, 'Cover');
    util.td(tr, 'Scans');

    // create rows
    delta.diffs.forEach(diff => {
      switch (diff.type) {
        case 'EQUAL':
        case 'MINUS':
          this._rows(table, diff.type, diff.original);
          break

        case 'PLUS':
          this._rows(table, diff.type, diff.revised);
          break

        case 'CHANGE':
          this._rowsChange(table, changes, diff.type, diff.original, diff.revised);
          break
      }
    });
  },

  _rows(table, diffType, albums) {
    albums.forEach(album => this._row(table, diffType, album));
  },

  _row(table, diffType, a) {
    const self = this;

    // action on row select
    const tr = util.tr(table, 'ad-' + diffType, function () {
      self._rowEdit(tr, diffType, a);
    });

    // diffType
    util.td(tr, this.DIFF_TYPE_MAP[diffType], 'bl');

    // position
    util.td(tr, a.position, 'ar');

    // type
    const type = a.maType ? '<i title="' + a.type + '">' + a.maType + '*</i>' : a.type;
    util.td(tr, type);

    // typeCount
    const typeCount = a.maTypeCount ? '<i title="' + util.int2(a.typeCount) + '">' + util.int2(a.maTypeCount) + '*</i>' : util.int2(a.typeCount);
    util.td(tr, typeCount, 'ar');

    // name
    const name = a.maName ? '<i title="' + a.name + '">' + a.maName + '*</i>' : a.name;
    util.td(tr, name);

    // year
    util.td(tr, a.year, 'ar');

    // calculate warning
    const warningStatus = (a.status === 'PRESENT' && a.statusMP3 !== 'PRESENT') || (a.status !== 'PRESENT' && a.statusMP3 === 'PRESENT');

    // status db
    util.td(tr, this.STATUS_MAP[a.status], 'ac ad-' + (warningStatus ? 'NOT_PRESENT' : (a.status === 'PRESENT' ? a.status : '')));

    // status mp3
    util.td(tr, this.STATUS_MAP[a.statusMP3], 'ac ad-' + (warningStatus ? 'NOT_PRESENT' : (a.statusMP3 === 'PRESENT' ? a.statusMP3 : '')));

    // status cover
    util.td(tr, this.STATUS_MAP[a.statusCover], 'ac ad-' + (a.statusCover === 'PRESENT' ? a.statusCover : ''));

    // status scans
    util.td(tr, this.STATUS_MAP[a.statusScans], 'ac ad-' + (a.statusScans === 'PRESENT' ? a.statusScans : ''));

    return tr;
  },

  _rowEdit(tr, diffType, a) {
    // cancel function
    const cancelFunction = function () {
      parentNode.removeChild(trEdit1);
      parentNode.removeChild(trEdit2);
      tr.style.display = 'revert';
    };

    // hide original tr
    tr.style.display = 'none';
    const parentNode = tr.parentNode;

    // create row edit 1
    const trEdit1 = this._rowEdit1(diffType, a);
    parentNode.insertBefore(trEdit1, tr.nextSibling);

    // create row edit 2
    const trEdit2 = this._rowEdit2(diffType, a,
      function () {
        cancelFunction();
      },
      function () {
        cancelFunction();
      });
    parentNode.insertBefore(trEdit2, trEdit1.nextSibling);
  },

  _rowEdit1(diffType, a) {
    const tr = util.tr(null, 'ad-' + diffType);

    // diffType
    util.td(tr, this.DIFF_TYPE_MAP[diffType], 'bl');

    // position
    const position = util.text(null, a.position, 'ar w25');
    util.td(tr, position);

    // type
    const type = util.text(null, a.type, 'w90');
    util.td(tr, type);

    // typeCount
    const typeCount = util.text(null, a.typeCount, 'ar w25');
    util.td(tr, typeCount);

    // name
    const name = util.text(null, a.name, 'w300');
    util.td(tr, name);

    // year
    const year = util.text(null, a.year, 'ar w35');
    util.td(tr, year);

    // status db
    const status = util.select(null, this.STATUS_MAP, this.STATUS_MAP[a.status]);
    util.td(tr, status, 'ac', null, 4);

    return tr;
  },

  _rowEdit2(diffType, a, saveF, cancelF) {
    const tr = util.tr(null, 'ad-' + diffType);
    util.td(tr, null, null, null, 2);

    // type
    const maType = util.text(null, a.maType, 'w90');
    util.td(tr, maType);

    // typeCount
    const maTypeCount = util.text(null, a.maTypeCount, 'ar w25');
    util.td(tr, maTypeCount);

    // name
    const maName = util.text(null, a.maName, 'w300');
    util.td(tr, maName);

    // actions
    util.td(tr);
    const saveButton = util.button(null, 'ok', 'bt-ok', saveF);
    util.td(tr, saveButton, 'ac', null, 2);

    const cancelButton = util.button(null, 'cancel', 'bt-cancel', cancelF);
    util.td(tr, cancelButton, 'ac', null, 2);

    return tr;
  },

  _rowsChange(table, changes, diffType, original, revised) {
    let i = 0

    for (; i < original.length; i++) {
      // add the original album
      const tr = this._row(table, diffType, original[i]);

      // add the revised album (on the right side)
      if (i < revised.length) {
        this._rowRevised(tr, revised[i], i === 0 ? 'bt' : null);
      }
    }

    // add the remaining revised album (on the right side)
    if (i < revised.length) {
      // FIXME empty rows
      const tr = null;
      for (; i < revised.length; i++) {
        this._rowRevised(tr, revised[i]);
      }
    }
  },

  _rowRevised(tr, a, className) {
    // position
    util.td(tr, a.position, className);

    // type
    util.td(tr, a.type, className);

    // typeCount
    util.td(tr, util.int2(a.typeCount), className);

    // name
    util.td(tr, a.name, className);

    // year
    util.td(tr, a.year, className);
  }

};
