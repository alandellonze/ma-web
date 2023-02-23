const ApiUtil = {

  // SYNC

  _apiLocation: 'http://' + window.location.hostname + ':8027',

  _methods: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  },

  get: function (uriPath, body) {
    return this._sendRequest(this._methods.GET, uriPath, body);
  },

  post: function (uriPath, body) {
    return this._sendRequest(this._methods.POST, uriPath, body);
  },

  put: function (uriPath, body) {
    return this._sendRequest(this._methods.PUT, uriPath, body);
  },

  del: function (uriPath, body) {
    return this._sendRequest(this._methods.DELETE, uriPath, body);
  },

  _sendRequest: function (method, uriPath, body) {
    const xmlHttp = util.createXmlHttpRequest();
    xmlHttp.open(method, this._apiLocation + uriPath, false);

    try {
      if (body === undefined) {
        xmlHttp.send();
      } else {
        xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xmlHttp.send(JSON.stringify(body));
      }
    } catch (e) {
      return {
        status: 500,
        message: e
      };
    }

    let responseObj;
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      if (xmlHttp.responseText === '') {
        responseObj = {};
      } else {
        try {
          // http response is a json
          responseObj = JSON.parse(xmlHttp.responseText);
        } catch (e) {
          // http response was not a json but a plain text message
          responseObj = xmlHttp.responseText;
        }
      }
    } else {
      // otherwise return the error message
      responseObj = xmlHttp.responseText;
    }

    // return response
    return this._handleResponse({
      status: xmlHttp.status,
      message: responseObj
    });
  },

  _handleResponse: function (response) {
    if (!response) {
      return null;
    }

    if (response.status !== 200) {
      toast.ko(labels.translate('apiLoadError') + ' ' + response.message);
      return null;
    }

    return response.message;
  },

  // ASYNC

  postAsync: function (uriPath, body, preventBeforeAfter) {
    return this._sendRequestAsync(this._methods.POST, uriPath, body, preventBeforeAfter);
  },

  getAsync: function (uriPath, body, preventBeforeAfter) {
    return this._sendRequestAsync(this._methods.GET, uriPath, body, preventBeforeAfter);
  },

  _sendRequestAsync: function (method, uriPath, body, preventBeforeAfter) {
    // block the user with the overlay
    const canCallBeforeAfter = preventBeforeAfter || (preventBeforeAfter === undefined);
    this._beforeSendRequest(canCallBeforeAfter);

    // create the promise
    const promise = new Promise(function (resolve, reject) {
      // prepare the call
      const xmlHttp = util.createXmlHttpRequest();
      xmlHttp.open(method, ApiUtil._apiLocation + uriPath);

      // on success
      xmlHttp.onload = function () {
        // success
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          // get responseObj
          let response;
          if (xmlHttp.responseText === '') {
            response = {};
          } else {
            try {
              response = JSON.parse(xmlHttp.responseText);
            } catch (e) {
              response = xmlHttp.responseText;
            }
          }

          // resolve
          resolve(response);
        }

        // failure: reject
        else {
          reject(xmlHttp);
        }
      }

      // on error: reject
      xmlHttp.onerror = function () {
        reject(xmlHttp);
      };

      // execute call
      try {
        if (body === undefined) {
          xmlHttp.send();
        } else {
          xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
          xmlHttp.send(JSON.stringify(body));
        }
      } catch (e) {
        reject({ status: 500, responseText: e });
      }
    });

    // define common behaviours for the promise
    return promise
      // catch
      .catch(function (xmlHttp) {
        // show failure message
        toast.ko(labels.translate('apiLoadError') + ' ' + xmlHttp.responseText);
      })

      // finally
      .finally(function () {
        // unblock the user with the overlay
        ApiUtil._afterSendRequest(canCallBeforeAfter);
      });
  },

  _beforeSendRequest: function (canCallBeforeAfter) {
    if (canCallBeforeAfter) {
      util.show('submit-overlay');
      util.disableKeyDown();
    }
  },

  _afterSendRequest: function (canCallBeforeAfter) {
    if (canCallBeforeAfter) {
      util.hide('submit-overlay');
      util.resetKeyDown();
    }
  }

};
