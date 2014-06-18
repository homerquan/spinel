var hummingbird;

hummingbird = function(variantsObj) {
  var idx;
  idx = new hummingbird.Index(variantsObj);
  return idx;
};

hummingbird.loggingOn = false;

hummingbird.version = "0.7.1";

hummingbird.index_version = "4.0";

if (typeof module !== 'undefined' && module !== null) {
  module.exports = hummingbird;
}

hummingbird.Utils = function() {
  this.root = {};
};

hummingbird.Utils.prototype.warn = function(message) {
  if (console.warn) {
    return console.warn(message);
  }
};

hummingbird.Utils.prototype.debugLog = function(msg) {
  if (console.log && hummingbird.loggingOn) {
    return console.log("" + msg);
  }
};

hummingbird.Utils.prototype.logTiming = function(msg, s) {
  var d;
  if (console.log && hummingbird.loggingOn) {
    d = new Date();
    if (s != null) {
      console.log("" + (d.toTimeString().split(' ')[0]) + "." + (d.getMilliseconds()) + " - " + msg + " in " + (d - s) + " ms");
    } else {
      console.log("" + (d.toTimeString().split(' ')[0]) + "." + (d.getMilliseconds()) + " - " + msg);
    }
    return d;
  }
};

hummingbird.Utils.prototype.normalizeString = function(str) {
  var re_start;
  re_start = /^\u0002/;
  str = diacritics.remove((str.toString()).toLowerCase());
  str = str.replace(re_start, '');
  return '\u0002' + str;
};

hummingbird.Utils.prototype.maxScore = function(phrase, tokenizer, prefixBoost) {
  var score;
  score = 0;
  if (phrase == null) {
    return score;
  }
  (tokenizer.tokenize(phrase)).forEach((function(token, i, tokens) {
    return score += this.tokenScore(token, false, prefixBoost);
  }), this);
  return score;
};

hummingbird.Utils.prototype.tokenScore = function(token, isVariant, prefixBoost) {
  var score;
  if (isVariant == null) {
    isVariant = false;
  }
  if (prefixBoost == null) {
    prefixBoost = true;
  }
  score = token.length;
  if (prefixBoost && token.substring(0, 1) === '\u0002') {
    score += 0.2;
  }
  if (isVariant) {
    score -= 0.4;
  }
  return score;
};

hummingbird.EventEmitter = function() {
  this.events = {};
};

hummingbird.EventEmitter.prototype.addListener = function() {
  var args, fn, names;
  args = Array.prototype.slice.call(arguments);
  fn = args.pop();
  names = args;
  if (typeof fn !== 'function') {
    throw new TypeError('last argument must be a function');
  }
  names.forEach((function(name) {
    if (!this.hasHandler(name)) {
      this.events[name] = [];
    }
    this.events[name].push(fn);
  }), this);
};

hummingbird.EventEmitter.prototype.removeListener = function(name, fn) {
  var fnIndex;
  if (!this.hasHandler(name)) {
    return;
  }
  fnIndex = this.events[name].indexOf(fn);
  this.events[name].splice(fnIndex, 1);
  if (!this.events[name].length) {
    delete this.events[name];
  }
};

hummingbird.EventEmitter.prototype.emit = function(name) {
  var args;
  if (!this.hasHandler(name)) {
    return;
  }
  args = Array.prototype.slice.call(arguments, 1);
  this.events[name].forEach(function(fn) {
    fn.apply(undefined, args);
  });
};

hummingbird.EventEmitter.prototype.hasHandler = function(name) {
  return name in this.events;
};

hummingbird.Index = function(variantsObj) {
  this.tokenStore = new hummingbird.TokenStore;
  this.metaStore = new hummingbird.MetaStore;
  if (variantsObj != null) {
    this.variantStore = new hummingbird.VariantStore(variantsObj);
  } else {
    this.variantStore = new hummingbird.VariantStore;
  }
  this.eventEmitter = new hummingbird.EventEmitter;
  this.tokenizer = new hummingbird.tokenizer;
  this.utils = new hummingbird.Utils;
};

hummingbird.Index.prototype.on = function() {
  var args;
  args = Array.prototype.slice.call(arguments);
  return this.eventEmitter.addListener.apply(this.eventEmitter, args);
};

hummingbird.Index.prototype.off = function(name, fn) {
  return this.eventEmitter.removeListener(name, fn);
};

hummingbird.Index.load = function(serializedData) {
  var idx;
  idx = new this;
  if (serializedData.index_version !== hummingbird.index_version) {
    idx.utils.warn('version mismatch: current ' + hummingbird.index_version + ' importing ' + serializedData.index_version);
  }
  idx.tokenStore = hummingbird.TokenStore.load(serializedData.tokenStore);
  idx.metaStore = serializedData.hasOwnProperty('metaStore') ? hummingbird.MetaStore.load(serializedData.metaStore) : undefined;
  idx.variantStore = serializedData.hasOwnProperty('variantStore') ? hummingbird.VariantStore.load(serializedData.variantStore) : undefined;
  return idx;
};

hummingbird.Index.prototype.add = function(doc, emitEvent, indexCallback) {
  var allDocumentTokens, name, token, tokens, variant_tokens, _i, _j, _len, _len1;
  allDocumentTokens = {};
  emitEvent = (emitEvent === undefined ? true : emitEvent);
  if (this.metaStore.has(doc.id)) {
    console.warn("Document " + doc.id + " already indexed, replacing");
    this.update(doc, emitEvent);
    return;
  }
  if (indexCallback) {
    name = "" + (indexCallback(doc));
  } else {
    name = doc['name'];
  }
  tokens = this.tokenizer.tokenize(name);
  variant_tokens = this.variantStore.getVariantTokens(name, this.tokenizer, tokens);
  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
    token = tokens[_i];
    this.tokenStore.add(token, false, doc.id);
  }
  for (_j = 0, _len1 = variant_tokens.length; _j < _len1; _j++) {
    token = variant_tokens[_j];
    this.tokenStore.add(token, true, doc.id);
  }
  this.metaStore.add(doc);
  if (emitEvent) {
    this.eventEmitter.emit('add', doc, this);
  }
};

hummingbird.Index.prototype.remove = function(docRef, emitEvent) {
  emitEvent = (emitEvent === undefined && this.metaStore.has(docRef) ? true : emitEvent);
  this.metaStore.remove(docRef);
  this.tokenStore.remove(docRef);
  if (emitEvent) {
    this.eventEmitter.emit('remove', docRef, this);
  }
};

hummingbird.Index.prototype.update = function(doc, emitEvent) {
  emitEvent = (emitEvent === undefined ? true : emitEvent);
  this.remove(doc.id, false);
  this.add(doc, false);
  if (emitEvent) {
    this.eventEmitter.emit('update', doc, this);
  }
};

hummingbird.Index.prototype.search = function(query, callback, options) {
  var docSetArray, docSetHash, finishTime, hasSomeToken, key, maxScore, minNumQueryTokens, minScore, n, numResults, offset, prefixBoost, queryTokens, resultSet, results, startHashArray, startTime;
  this.utils.debugLog('**********');
  startTime = this.utils.logTiming('find matching docs');
  if ((query == null) || query.length < (this.tokenizer.min - 1)) {
    callback([]);
  }
  numResults = (options != null ? options.howMany : void 0) === undefined ? 10 : Math.floor(options.howMany);
  offset = (options != null ? options.startPos : void 0) === undefined ? 0 : Math.floor(options.startPos);
  prefixBoost = options != null ? options.boostPrefix : void 0;
  docSetHash = {};
  docSetArray = [];
  queryTokens = this.tokenizer.tokenize(query);
  maxScore = this.utils.maxScore(query, this.tokenizer, prefixBoost);
  if ((options != null ? options.scoreThreshold : void 0) == null) {
    minScore = 0.5 * maxScore;
    minNumQueryTokens = Math.ceil(queryTokens.length * 0.5);
  } else if ((options != null ? options.scoreThreshold : void 0) <= 0) {
    minScore = 0;
    minNumQueryTokens = queryTokens.length;
  } else if ((options != null ? options.scoreThreshold : void 0) >= 1) {
    minScore = maxScore;
    minNumQueryTokens = 0;
  } else {
    minScore = options.scoreThreshold * maxScore;
    minNumQueryTokens = Math.ceil(queryTokens.length * (1 - options.scoreThreshold));
  }
  hasSomeToken = queryTokens.some(function(token) {
    return this.tokenStore.has(token);
  }, this);
  if (!hasSomeToken) {
    callback([]);
  }
  queryTokens.forEach((function(token, i, tokens) {
    var docRef, startMatchTime, startVariantMatch, _i, _j, _len, _len1, _ref, _ref1;
    startMatchTime = this.utils.logTiming("'" + token + "' score start");
    _ref = this.tokenStore.get(token, false);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      docRef = _ref[_i];
      switch (false) {
        case !((docSetHash[docRef] == null) && i <= minNumQueryTokens):
          docSetHash[docRef] = this.utils.tokenScore(token, false, prefixBoost);
          break;
        case docSetHash[docRef] == null:
          docSetHash[docRef] += this.utils.tokenScore(token, false, prefixBoost);
      }
    }
    startVariantMatch = this.utils.logTiming("\t\toriginal name:\t\t" + (this.tokenStore.get(token, false).length) + " ", startMatchTime);
    _ref1 = this.tokenStore.get(token, true);
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      docRef = _ref1[_j];
      switch (false) {
        case !((docSetHash[docRef] == null) && i <= minNumQueryTokens):
          docSetHash[docRef] = this.utils.tokenScore(token, true, prefixBoost);
          break;
        case docSetHash[docRef] == null:
          docSetHash[docRef] += this.utils.tokenScore(token, true, prefixBoost);
      }
    }
    this.utils.logTiming("\t\tvariant matches:\t" + (this.tokenStore.get(token, true).length) + " ", startVariantMatch);
  }), this);
  startHashArray = this.utils.logTiming('hash to sorted array\n');
  for (key in docSetHash) {
    if (docSetHash[key] >= minScore) {
      n = this.metaStore.get(key).name.toLowerCase();
      docSetArray.push({
        id: key,
        score: query.toLowerCase() === n ? docSetHash[key] + 0.1 : docSetHash[key],
        n: n
      });
    }
  }
  docSetArray.sort(function(a, b) {
    if (a.score === b.score) {
      switch (false) {
        case !(a.n < b.n):
          return -1;
        case !(a.n > b.n):
          return 1;
        default:
          return 0;
      }
    } else {
      return b.score - a.score;
    }
  });
  results = docSetArray.slice(offset, numResults);
  this.utils.debugLog("score\tname (id)");
  resultSet = results.map(function(result, i, results) {
    result = this.metaStore.get(result.id);
    result.score = Math.round(results[i].score * 10) / 10;
    this.utils.debugLog("" + result.score + "\t" + result.name + " (" + result.id + ")");
    return result;
  }, this);
  callback(resultSet);
  this.utils.debugLog("");
  finishTime = this.utils.logTiming('SUMMARY:');
  this.utils.debugLog("hash size:\t" + (Object.keys(docSetHash).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
  this.utils.debugLog("array size:\t" + (docSetArray.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
  this.utils.debugLog("min score:\t" + minScore);
  this.utils.debugLog("max score:\t" + maxScore);
  this.utils.debugLog("query time:\t" + (finishTime - startTime) + " ms");
  this.utils.debugLog("\t\t" + (startHashArray - startTime) + " ms - finding docs");
  this.utils.debugLog("\t\t" + (finishTime - startHashArray) + " ms - hash to array");
  return this.utils.debugLog("***************");
};

hummingbird.Index.prototype.jump = function(query, callback) {
  var r, startTime;
  this.utils.debugLog('**********');
  startTime = this.utils.logTiming('get matching doc');
  if ((query == null) || query.length < 1) {
    return callback([]);
  } else {
    r = this.metaStore.get(query);
    if (r != null) {
      return callback([r]);
    } else {
      return callback([]);
    }
  }
};

hummingbird.Index.prototype.toJSON = function() {
  return {
    version: hummingbird.version,
    index_version: hummingbird.index_version,
    tokenStore: this.tokenStore.toJSON(),
    metaStore: this.metaStore.toJSON(),
    variantStore: this.variantStore.toJSON()
  };
};

hummingbird.MetaStore = function() {
  this.root = {};
};

hummingbird.MetaStore.load = function(serializedData) {
  var store;
  store = new this;
  store.root = serializedData.root;
  return store;
};

hummingbird.MetaStore.prototype.toJSON = function() {
  return {
    root: this.root
  };
};

hummingbird.MetaStore.prototype.add = function(doc) {
  if (!(this.has(doc['id']) || doc === undefined)) {
    this.root[doc['id']] = doc;
  }
};

hummingbird.MetaStore.prototype.has = function(docId) {
  if (!docId) {
    return false;
  }
  if (docId in this.root) {
    return true;
  } else {
    return false;
  }
};

hummingbird.MetaStore.prototype.get = function(docId) {
  return this.root[docId];
};

hummingbird.MetaStore.prototype.remove = function(docId) {
  if (!docId || !this.root[docId]) {
    return;
  }
  return delete this.root[docId];
};

hummingbird.TokenStore = function() {
  this.root = {};
};

hummingbird.TokenStore.load = function(serializedData) {
  var store;
  store = new this;
  store.root = serializedData.root;
  return store;
};

hummingbird.TokenStore.prototype.toJSON = function() {
  return {
    root: this.root
  };
};

hummingbird.TokenStore.prototype.add = function(token, isVariant, docId) {
  var _base, _base1, _base2;
  if ((_base = this.root)[token] == null) {
    _base[token] = {};
  }
  if (!isVariant) {
    if ((_base1 = this.root[token])['n'] == null) {
      _base1['n'] = [];
    }
    if (this.root[token]['n'].indexOf(docId) === -1) {
      this.root[token]['n'].push(docId);
    }
  } else {
    if ((this.root[token]['n'] == null) || this.root[token]['n'].indexOf(docId) === -1) {
      if ((_base2 = this.root[token])['v'] == null) {
        _base2['v'] = [];
      }
      if (this.root[token]['v'].indexOf(docId) === -1) {
        this.root[token]['v'].push(docId);
      }
    }
  }
};

hummingbird.TokenStore.prototype.has = function(token) {
  if (!token) {
    return false;
  }
  if (token in this.root) {
    return true;
  } else {
    return false;
  }
};

hummingbird.TokenStore.prototype.get = function(token, isVariant) {
  var _ref, _ref1;
  if (isVariant) {
    if (((_ref = this.root[token]) != null ? _ref['v'] : void 0) != null) {
      return this.root[token]['v'];
    } else {
      return [];
    }
  } else {
    if (((_ref1 = this.root[token]) != null ? _ref1['n'] : void 0) != null) {
      return this.root[token]['n'];
    } else {
      return [];
    }
  }
};

hummingbird.TokenStore.prototype.count = function(token) {
  var count, _ref, _ref1;
  if (!token || !this.root[token]) {
    return 0;
  }
  count = 0;
  if (((_ref = this.root[token]) != null ? _ref['n'] : void 0) != null) {
    count += this.root[token]['n'].length;
  }
  if (((_ref1 = this.root[token]) != null ? _ref1['v'] : void 0) != null) {
    count += this.root[token]['v'].length;
  }
  return count;
};

hummingbird.TokenStore.prototype.remove = function(docRef) {
  return Object.keys(this.root).forEach((function(token) {
    var i;
    if (this.root[token]['n'] != null) {
      i = this.root[token]['n'].indexOf(docRef);
      if (i !== -1) {
        this.root[token]['n'].splice(i, 1);
      }
      if (Object.keys(this.root[token]['n']).length === 0) {
        delete this.root[token]['n'];
      }
    }
    if (this.root[token]['v'] != null) {
      i = this.root[token]['v'].indexOf(docRef);
      if (i !== -1) {
        this.root[token]['v'].splice(i, 1);
      }
      if (Object.keys(this.root[token]['v']).length === 0) {
        delete this.root[token]['v'];
      }
    }
    if (Object.keys(this.root[token]).length === 0) {
      delete this.root[token];
    }
  }), this);
};

hummingbird.tokenizer = function(min, max) {
  this.utils = new hummingbird.Utils;
  if (!arguments.length || (min == null) || typeof min !== 'number' || min < 1) {
    this.min = 3;
  } else {
    this.min = min;
  }
  if (arguments.length < 2 || (max == null) || typeof max !== 'number' || max < min) {
    this.max = this.min;
  } else {
    this.max = max;
  }
};

hummingbird.tokenizer.prototype.tokenize = function(name) {
  var alltokens, i, n, norm_name;
  norm_name = this.utils.normalizeString(name);
  if (norm_name == null) {
    return [];
  }
  alltokens = {};
  n = this.min;
  while (n <= this.max) {
    if (norm_name.length <= n) {
      alltokens[norm_name] = null;
    } else {
      i = 0;
      while (i <= norm_name.length - n) {
        alltokens[norm_name.slice(i, i + n)] = null;
        i++;
      }
    }
    n++;
  }
  return Object.keys(alltokens);
};

hummingbird.VariantStore = function(variantsObj) {
  var name, norm_name;
  this.variants = {};
  this.utils = new hummingbird.Utils;
  if (variantsObj != null) {
    for (name in variantsObj) {
      norm_name = this.utils.normalizeString(name);
      this.variants[norm_name] = [];
      variantsObj[name].forEach((function(variant, i, variants) {
        var normVariant;
        normVariant = this.utils.normalizeString(variant);
        return this.variants[norm_name].push(normVariant);
      }), this);
    }
  }
};

hummingbird.VariantStore.load = function(serializedData) {
  var store;
  store = new this;
  store.variants = serializedData.hasOwnProperty('variants') ? serializedData.variants : void 0;
  return store;
};

hummingbird.VariantStore.prototype.toJSON = function() {
  return {
    variants: this.variants
  };
};

hummingbird.VariantStore.prototype.getVariantTokens = function(name, tokenizer, tokens) {
  var matched_variants, norm_name, variant_tokens;
  matched_variants = [];
  variant_tokens = {};
  norm_name = this.utils.normalizeString(name);
  if ((norm_name == null) || norm_name === undefined) {
    return variant_tokens;
  }
  if (this.variants.hasOwnProperty(norm_name)) {
    this.variants[norm_name].forEach((function(variant, i, variants) {
      var token, _i, _len, _ref, _results;
      _ref = tokenizer.tokenize(variant);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        if (tokens.indexOf(token) === -1) {
          _results.push(variant_tokens[token] = null);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }), this);
  }
  if (norm_name !== norm_name.split(/\s+/)[0]) {
    norm_name.split(/\s+/).forEach((function(name_part, j, names) {
      if (this.variants.hasOwnProperty(name_part)) {
        return this.variants[name_part].forEach((function(variant, i, variants) {
          var token, _i, _len, _ref, _results;
          _ref = tokenizer.tokenize(variant);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            token = _ref[_i];
            if (tokens.indexOf(token) === -1) {
              _results.push(variant_tokens[token] = null);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }), this);
      }
    }), this);
  }
  return Object.keys(variant_tokens);
};
