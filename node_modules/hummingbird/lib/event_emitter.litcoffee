## EventEmitter
Manages adding, removing, and triggering events handlers

### constructor

    hummingbird.EventEmitter = ->
      @events = {}
      return

### ::addListener
Binds a handler function to specific events
Can bind a single function to many different events in one call

    hummingbird.EventEmitter::addListener = ->
      args = Array::slice.call(arguments)
      fn = args.pop()
      names = args
      throw new TypeError('last argument must be a function')  if typeof fn isnt 'function'
      names.forEach ((name) ->
        @events[name] = []  unless @hasHandler(name)
        @events[name].push fn
        return
      ), this
      return

### ::removeListener
Removes a handler function from a specific event

    hummingbird.EventEmitter::removeListener = (name, fn) ->
      return  unless @hasHandler(name)
      fnIndex = @events[name].indexOf(fn)
      @events[name].splice fnIndex, 1
      delete @events[name]  unless @events[name].length
      return


### ::emit
Calls all functions bound to the given event

    hummingbird.EventEmitter::emit = (name) ->
      return  unless @hasHandler(name)
      args = Array::slice.call(arguments, 1)
      @events[name].forEach (fn) ->
        fn.apply `undefined`, args
        return
      return


### ::hasHandler
Checks whether a handler has ever been stored against an event.

    hummingbird.EventEmitter::hasHandler = (name) ->
      name of @events
