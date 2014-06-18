# API

## Core

### constructor
Convenience function for instantiating a hummingbird index

    hummingbird = (variantsObj) ->
      idx = new hummingbird.Index variantsObj
      idx

### .loggingOn
Set to true or false to enable or disable logging respectively
Defaults to false

    hummingbird.loggingOn = false

### .version
Version of the hummingbird code base

    hummingbird.version = "@@VERSION"

### .index_version
Version of the index data structure

    hummingbird.index_version = "@@INDEX_VERSION"
    if typeof module isnt 'undefined' and module isnt null
      module.exports = hummingbird
