## TokenStore
The inverted index that maps each token in the corpus to all the names
that contain said token

### constructor

    hummingbird.TokenStore = ->
      @root = {}
      return

### .load
Loads a previously serialized token store

    hummingbird.TokenStore.load = (serializedData) ->
      store = new this
      store.root = serializedData.root
      store

### ::toJSON
Returns a representation of the token store ready for serialization.

    hummingbird.TokenStore::toJSON = ->
      root: @root

### ::add
Adds to the store a new token and document 'id', and distinguishes between variant doc matches and normal name matches.

    hummingbird.TokenStore::add = (token, isVariant, docId) ->
      @root[token] ?= {}
      unless isVariant
        # name token matches for this document
        @root[token]['n'] ?= []
        @root[token]['n'].push docId if @root[token]['n'].indexOf(docId) is -1
      else
        # variant-only token matches for this document
        if not @root[token]['n']? or @root[token]['n'].indexOf(docId) is -1
          @root[token]['v'] ?= []
          @root[token]['v'].push(docId) if @root[token]['v'].indexOf(docId) is -1
      return

### ::has
Checks whether this key is contained within this hummingbird.TokenStore.

    hummingbird.TokenStore::has = (token) ->
      return false unless token
      if token of @root
        return true
      else
        return false
      return


### ::get
Retrieve the documents for the given token

    hummingbird.TokenStore::get = (token, isVariant) ->
      if isVariant
        if @root[token]?['v']? then @root[token]['v'] else []
      else
        if @root[token]?['n']? then @root[token]['n'] else []

### ::count
Number of documents associated with the given token

    hummingbird.TokenStore::count = (token) ->
      return 0  if not token or not @root[token]
      count = 0
      count += @root[token]['n'].length if @root[token]?['n']?
      count += @root[token]['v'].length if @root[token]?['v']?
      return count

### ::remove
Remove the document identified by docRef from each token in the store where it appears.

    hummingbird.TokenStore::remove = (docRef) ->
      Object.keys(this.root).forEach ((token) ->
        if @root[token]['n']?
          i = @root[token]['n'].indexOf docRef
          @root[token]['n'].splice i, 1 unless i is -1
          delete @root[token]['n'] if Object.keys(@root[token]['n']).length is 0

        if @root[token]['v']?
          i = @root[token]['v'].indexOf docRef
          @root[token]['v'].splice i, 1 unless i is -1
          delete @root[token]['v'] if Object.keys(@root[token]['v']).length is 0

        delete @root[token] if Object.keys(@root[token]).length is 0
        return
      ), this
