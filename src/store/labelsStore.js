const labelsStore = {

  cache: {},

  get: function (key) {
    // load from server if not in the cache
    if (!this.cache[key]) {
      // load from the server
      const xmlHttp = util.createXmlHttpRequest();
      xmlHttp.open('GET', 'assets/locales/' + key + '.json?' + new Date().getTime(), false);
      xmlHttp.send();

      // put in the cache
      this.cache[key] = JSON.parse(xmlHttp.responseText);
    }

    // return value from the cache
    return this.cache[key];
  }

};
