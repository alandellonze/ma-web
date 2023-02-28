function AlbumDiff(id, bandDetail) {
  this.id = id;
  this.bandDetail = bandDetail;
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

  id: null,
  bandDetail: null,

  update(delta) {
    let changes = delta.changes;

    // create table
    const table = util.emptyTable(this.id);

    // create header
    const tr = util.tr(table);
    util.td(tr, null, null, null, 3);
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
    for (let i = 0; i < albums.length; i++) {
      this._row(table, diffType, albums[i], i);
    }
  },

  _row(table, diffType, a, index) {
    const self = this;

    // action on row select
    const tr = util.tr(table, 'ad-' + diffType, function () {
      self._rowEdit(tr, diffType, a);
    });

    // position
    util.td(tr, a.position, 'ar bl');

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
    const warningStatus = (a.status === 'PRESENT' && !['PRESENT', 'TMP'].includes(a.statusMP3)) || (a.status !== 'PRESENT' && ['PRESENT', 'TMP'].includes(a.statusMP3));

    // status db
    util.td(tr, this.STATUS_MAP[a.status], 'ac ad-' + (warningStatus ? 'NOT_PRESENT' : (['PRESENT', 'TMP'].includes(a.status) ? a.status : '')));

    // status mp3
    util.td(tr, this.STATUS_MAP[a.statusMP3], 'ac ad-' + (warningStatus ? 'NOT_PRESENT' : (['PRESENT', 'TMP'].includes(a.statusMP3) ? a.statusMP3 : '')));

    // status cover
    util.td(tr, this.STATUS_MAP[a.statusCover], 'ac ad-' + (a.statusCover === 'PRESENT' ? a.statusCover : ''));

    // status scans
    util.td(tr, this.STATUS_MAP[a.statusScans], 'ac ad-' + (a.statusScans === 'PRESENT' ? a.statusScans : ''));

    // diffType
    this._addDiffTypeAction(tr, diffType, a, index);

    return tr;
  },

  _addDiffTypeAction(tr, diffType, a, index) {
    if (diffType !== 'EQUAL') {
      let content;
      let self = this;

      switch (diffType) {
        case 'MINUS':
          content = util.button(null, '-', 'bt-cancel', async function (event) {
            event.stopPropagation();
            await ApiService.deleteAlbum(a.bandId, a.id);
            self.bandDetail.reload();
          });
          break;

        case 'PLUS':
          content = util.button(null, '+', 'bt-ok', async function (event) {
            event.stopPropagation();
            await ApiService.saveAlbum(a);
            self.bandDetail.reload();
          });
          break;

        default:
          content = this.DIFF_TYPE_MAP[diffType];
          break;
      }

      util.td(tr, content, 'ac' + (index === 0 ? ' bt' : ''));
    }
  },

  _rowsChange(table, changes, diffType, original, revised) {
    let i = 0

    for (; i < original.length; i++) {
      // add the original album
      const tr = this._row(table, diffType, original[i], i);

      // add the revised album (on the right side)
      if (i < revised.length) {
        this._rowRevised(tr, revised[i], i === 0 ? 'bt' : null);
      }
    }

    // add the remaining revised album (on the right side)
    if (i < revised.length) {
      for (; i < revised.length; i++) {
        const self = this;
        const a = revised[i];

        // action on row select
        const tr = util.tr(table, 'ad-' + diffType, function () {
          self._rowEdit(tr, diffType, a);
        });

        // add empty td
        util.td(tr, null, null, null, 10);

        // add the revised album (on the right side)
        this._rowRevised(tr, a);
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
  },

  // edit

  _rowEdit(tr, diffType, a) {
    const self = this;

    // init edited object
    let edited = {
      id: a.id,
      bandId: a.bandId
    };

    // hide original tr
    tr.style.display = 'none';
    const parentNode = tr.parentNode;

    // create row edit 1
    const trEdit1 = this._rowEdit1(diffType, a, edited);
    parentNode.insertBefore(trEdit1, tr.nextSibling);

    // create row edit 2
    const trEdit2 = this._rowEdit2(diffType, a, edited,
      async function () {
        await ApiService.saveAlbum(edited);
        self.bandDetail.reload();
      },
      function () {
        parentNode.removeChild(trEdit1);
        parentNode.removeChild(trEdit2);
        tr.style.display = 'revert';
      });
    parentNode.insertBefore(trEdit2, trEdit1.nextSibling);
  },

  _rowEdit1(diffType, a, edited) {
    const tr = util.tr(null, 'ad-' + diffType);

    // position
    const position = this._addText(a, edited, 'position', 'ar w25');
    util.td(tr, position);

    // type
    const type = this._addText(a, edited, 'type', 'w95');
    util.td(tr, type);

    // typeCount
    const typeCount = this._addText(a, edited, 'typeCount', 'ar w25');
    util.td(tr, typeCount);

    // name
    const name = this._addText(a, edited, 'name', 'w300');
    util.td(tr, name);

    // year
    const year = this._addText(a, edited, 'year', 'ar w35');
    util.td(tr, year);

    // status db
    const status = this._addSelect(a, edited, 'status', this.STATUS_MAP);
    util.td(tr, status, 'ac', null, 4);

    // diffType
    this._addDiffTypeAction(tr, diffType, a, 0);

    return tr;
  },

  _rowEdit2(diffType, a, edited, saveF, cancelF) {
    const tr = util.tr(null, 'ad-' + diffType);
    util.td(tr);

    // type
    const maType = this._addText(a, edited, 'maType', 'w95');
    util.td(tr, maType);

    // typeCount
    const maTypeCount = this._addText(a, edited, 'maTypeCount', 'ar w25');
    util.td(tr, maTypeCount);

    // name
    const maName = this._addText(a, edited, 'maName', 'w300');
    util.td(tr, maName);

    // actions
    util.td(tr);
    const saveButton = util.button(null, 'ok', 'bt-ok', saveF);
    util.td(tr, saveButton, 'ac', null, 2);

    const cancelButton = util.button(null, 'cancel', 'bt-cancel', cancelF);
    util.td(tr, cancelButton, 'ac', null, 2);

    return tr;
  },

  _addText(a, edited, field, className) {
    // init value
    edited[field] = a[field];

    // create text
    const text = util.text(null, a[field], className);

    // bind event
    text.onkeyup = function () {
      edited[field] = this.value === '' ? null : this.value;
    };

    return text;
  },

  _addSelect(a, edited, field, values) {
    // init value
    edited[field] = util.getKeyByValue(values, values[a[field]]);

    // create text
    const select = util.select(null, values, values[a[field]]);

    // bind event
    select.onchange = function () {
      edited[field] = util.getKeyByValue(values, this.value);
    };

    return select
  }

};
