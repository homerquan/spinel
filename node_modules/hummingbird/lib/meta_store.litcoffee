## MetaStore
Maps each id from the TokenStore to its stored, _untokenized_ fields in the MetaStore

### constructor

    hummingbird.MetaStore = ->
      @root = {}
      return

### .load
Loads a previously serialized MetaStore

    hummingbird.MetaStore.load = (serializedData) ->
      store = new this
      store.root = serializedData.root
      store

### ::toJSON
Returns a JSON representation of the MetaStore

    hummingbird.MetaStore::toJSON = ->
      root: @root

### ::add
Adds a hash of name-value pairs to the MetaStore

    hummingbird.MetaStore::add = (doc) ->
      @root[doc['id']] = doc unless @has(doc['id']) or doc is `undefined`
      return

### ::has
Checks for this id in the MetaStore

    hummingbird.MetaStore::has = (docId) ->
      return false  unless docId
      if docId of @root
        return true
      else
        return false
      return

### ::get
Retrieve the name-value pairs associated with this id

    hummingbird.MetaStore::get = (docId) ->
      @root[docId]

### ::remove
Remove the name-value pairs associated with this id

    hummingbird.MetaStore::remove = (docId) ->
      return  if not docId or not @root[docId]
      delete @root[docId]
