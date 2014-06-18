## Index
The object that manages everything

Most importantly it contains the inverted index of tokens
found in each name in the corpus, associated meta data, and methods
for interacting with the data

### constructor
Set _hummingbird.Index.tokenizer_ to any javascript object that has
a method _tokenize_ that takes a string and returns an array of values
that will be used to find this string when the index is searched.

Example:
```javascript
idx = new hummingbird.index();
idx.tokenizer = new hummingbird.tokenizer(2,3)
idx.variantStore.variants = {'steve': ['steven', 'stephen', 'stefan']}
```

    hummingbird.Index = (variantsObj) ->
      @tokenStore = new hummingbird.TokenStore
      @metaStore = new hummingbird.MetaStore
      if variantsObj?
        @variantStore = new hummingbird.VariantStore variantsObj
      else
        @variantStore = new hummingbird.VariantStore
      @eventEmitter = new hummingbird.EventEmitter
      @tokenizer = new hummingbird.tokenizer
      @utils = new hummingbird.Utils
      return

### ::on
Binds handler to events emitted by the index

    hummingbird.Index::on = ->
      args = Array::slice.call(arguments)
      @eventEmitter.addListener.apply @eventEmitter, args

### ::off
Removes handler from event emitted by the index

    hummingbird.Index::off = (name, fn) ->
      @eventEmitter.removeListener name, fn

### ::load
Loads serialized index and issues a warning if the index being imported is in a different format
than what is now supported by this version of hummingbird

    hummingbird.Index.load = (serializedData) ->
      idx = new this
      idx.utils.warn 'version mismatch: current ' + hummingbird.index_version + ' importing ' + serializedData.index_version  if serializedData.index_version isnt hummingbird.index_version
      idx.tokenStore = hummingbird.TokenStore.load(serializedData.tokenStore)
      idx.metaStore = if serializedData.hasOwnProperty 'metaStore' then hummingbird.MetaStore.load(serializedData.metaStore) else `undefined`
      idx.variantStore = if serializedData.hasOwnProperty 'variantStore' then hummingbird.VariantStore.load(serializedData.variantStore) else `undefined`
      idx

### ::add
Add a name to the index (i.e., the tokenStore and its associated metadata to the metaStore)
Takes an Object as an argument.
* _doc.id_ = must be a unique identifier within a given index

Then, there are two options in order to have something to search:
* _doc.name_ = this string will be indexed
* _indexCallback_ = this function if provided will be called on _doc_ and must return
  the string to be indexed

Optionally includes additional arbitrary name-value pairs to be stored, but not indexed

    hummingbird.Index::add = (doc, emitEvent, indexCallback) ->
      allDocumentTokens = {}
      emitEvent = (if emitEvent is `undefined` then true else emitEvent)

      if @metaStore.has doc.id
        console.warn "Document #{doc.id} already indexed, replacing"
        @update doc, emitEvent
        return

      if indexCallback
        name = "#{indexCallback doc}"
      else
        name = doc['name']

      # tokenize the doc
      tokens = @tokenizer.tokenize name
      variant_tokens = @variantStore.getVariantTokens(name, @tokenizer, tokens)

      # add the name tokens to the tokenStore
      # do this before variant tokens are added to ensure tokens are distinct
      for token in tokens
        @tokenStore.add token, false, doc.id

      # add the variant tokens to the tokenStore
      for token in variant_tokens
        @tokenStore.add token, true, doc.id

      @metaStore.add doc
      @eventEmitter.emit 'add', doc, this  if emitEvent
      return

### ::remove
Removes the document from the index that is referenced by the 'id' property

    hummingbird.Index::remove = (docRef, emitEvent) ->
      emitEvent = (if emitEvent is `undefined` and @metaStore.has docRef then true else emitEvent)

      @metaStore.remove docRef
      @tokenStore.remove docRef
      @eventEmitter.emit 'remove', docRef, this  if emitEvent
      return

### ::update
Updates the document from the index that is referenced by the 'id' property
This method is just a wrapper around `remove` and `add`

    hummingbird.Index::update = (doc, emitEvent) ->
      emitEvent = (if emitEvent is `undefined` then true else emitEvent)

      @remove doc.id, false
      @add doc, false
      @eventEmitter.emit 'update', doc, this  if emitEvent
      return

### ::search
Takes a callback function that has the resultSet array as its only argument.
Optionally, takes an options object with the following possible properties
* _howMany_ - the maximum number of results to be returned (_default=10_)
* _startPos_ - how far into the sorted matched set should the returned resultset start (_default=0_)
* _scoreThreshold_ - (number between 0,1 inclusive) only matches with a score equal to or greater
  than this fraction of the maximum theoretical score will be returned in the result set (_default=0.5_,
  includes all matches)
* _boostPrefix_ - (boolean) if _true_ provides an additional boost to results that start with the first
  query token (_default=true_)

Finds matching names and returns them in order of best match.

    hummingbird.Index::search = (query, callback, options) ->
      @utils.debugLog '**********'
      startTime = @utils.logTiming 'find matching docs'
      if (not query? or query.length < (@tokenizer.min - 1)) then callback []

      # search options
      numResults = if (options?.howMany is `undefined`) then 10 else Math.floor(options.howMany)
      offset = if (options?.startPos is `undefined`) then 0 else Math.floor(options.startPos)
      prefixBoost = options?.boostPrefix

      # initialize result set vars and search options
      docSetHash = {}
      docSetArray = []
      queryTokens = @tokenizer.tokenize(query)
      maxScore = @utils.maxScore(query, @tokenizer, prefixBoost)
      if not options?.scoreThreshold?
        minScore = 0.5 * maxScore
        minNumQueryTokens = Math.ceil(queryTokens.length * 0.5)
      else if options?.scoreThreshold <= 0
        minScore = 0
        minNumQueryTokens = queryTokens.length
      else if options?.scoreThreshold >= 1
        minScore = maxScore
        minNumQueryTokens = 0
      else
        minScore = options.scoreThreshold * maxScore
        minNumQueryTokens = Math.ceil(queryTokens.length * (1 - options.scoreThreshold))

      hasSomeToken = queryTokens.some((token) ->
        @tokenStore.has token
      , this)
      callback []  unless hasSomeToken

      # retrieve docs from tokenStore
      queryTokens.forEach ((token, i, tokens) ->
        startMatchTime = @utils.logTiming "'#{token}' score start"
        # name matches
        for docRef in @tokenStore.get(token, false)
          switch
            when not docSetHash[docRef]? and i <= minNumQueryTokens
              docSetHash[docRef] = @utils.tokenScore(token, false, prefixBoost)
            when docSetHash[docRef]?
              docSetHash[docRef] += @utils.tokenScore(token, false, prefixBoost)
        startVariantMatch = @utils.logTiming "\t\toriginal name:\t\t#{@tokenStore.get(token, false).length} ", startMatchTime
        # variant matches
        for docRef in @tokenStore.get(token, true)
          switch
            when not docSetHash[docRef]? and i <= minNumQueryTokens
              docSetHash[docRef] = @utils.tokenScore(token, true, prefixBoost)
            when docSetHash[docRef]?
              docSetHash[docRef] += @utils.tokenScore(token, true, prefixBoost)
        @utils.logTiming "\t\tvariant matches:\t#{@tokenStore.get(token, true).length} ", startVariantMatch
        return
      ), this

      # convert hash to array of hashes for sorting
      # filter out results below the minScore
      # boost exact matches - consciously does not convert diacritics, but uncertain whether that's best
      startHashArray = @utils.logTiming 'hash to sorted array\n'
      for key of docSetHash
        if docSetHash[key] >= minScore
          n = @metaStore.get(key).name.toLowerCase()
          docSetArray.push
            id: key
            score: if query.toLowerCase() is n then docSetHash[key] + 0.1 else docSetHash[key]
            n: n

      docSetArray.sort (a, b) ->
        if a.score is b.score
          switch
            when a.n < b.n then -1
            when a.n > b.n then 1
            else 0
        else
          b.score - a.score

      # loop over limited return set and augment with meta
      results = docSetArray.slice offset, numResults
      @utils.debugLog "score\tname (id)"
      resultSet = (results.map (result, i, results) ->
        result = @metaStore.get result.id
        result.score = Math.round(results[i].score*10)/10
        @utils.debugLog "#{result.score}\t#{result.name} (#{result.id})"
        return result
      , this)
      callback resultSet
      @utils.debugLog ""
      finishTime = @utils.logTiming 'SUMMARY:'
      @utils.debugLog "hash size:\t#{Object.keys(docSetHash).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}"
      @utils.debugLog "array size:\t#{docSetArray.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}"
      @utils.debugLog "min score:\t#{minScore}"
      @utils.debugLog "max score:\t#{maxScore}"
      @utils.debugLog "query time:\t#{finishTime-startTime} ms"
      @utils.debugLog "\t\t#{startHashArray-startTime} ms - finding docs"
      @utils.debugLog "\t\t#{finishTime-startHashArray} ms - hash to array"
      @utils.debugLog "***************"

### ::jump
Takes a callback function that has the result object as its only argument.

    hummingbird.Index::jump = (query, callback) ->
      @utils.debugLog '**********'
      startTime = @utils.logTiming 'get matching doc'
      if (not query? or query.length < 1) then callback []
      else
        r = @metaStore.get(query)
        if r? then callback [r]
        else callback []

### ::toJSON
Returns a representation of the index ready for serialization.

    hummingbird.Index::toJSON = ->
      version: hummingbird.version
      index_version: hummingbird.index_version
      tokenStore: @tokenStore.toJSON()
      metaStore: @metaStore.toJSON()
      variantStore: @variantStore.toJSON()
