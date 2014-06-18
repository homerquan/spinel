module('hummingbird.Index')

test('adding a document with an empty field', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'test', title: ''}

  idx.add(doc)
  equal(Object.keys(idx.tokenStore.get('tes')).length, 1)
  equal(idx.tokenStore.get('tes',false).indexOf(1),0)
  ok(idx.metaStore.has("1"))
})

test('triggering add events', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('add', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.add(doc)

  ok(callbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)
})

test('Adding to index with callback', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, indexfield: 'this is a test', notname: 'this is metadata'},
      callbackCalled = false

  idx.add(doc, true, function (doc, index) {
    callbackCalled = true
    return doc.indexfield
  })

  ok(callbackCalled)
  equal(idx.tokenStore.get('tes',false).indexOf(1),0)
})

test('silencing add events', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('add', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.add(doc, false)

  ok(!callbackCalled)
})

test('removing a document from the index', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'this is a test'}

  equal(idx.metaStore.has(1), false)
  equal(idx.tokenStore.has('thi'), false)

  idx.add(doc)
  equal(idx.metaStore.has(1), true)
  equal(idx.tokenStore.has('thi'), true)

  idx.remove(doc.id)
  equal(idx.metaStore.has(1), false)
  equal(idx.tokenStore.has('thi'), false)
})

test('triggering remove events', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('remove', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.add(doc)
  idx.remove(doc.id)

  ok(callbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc.id)
  deepEqual(callbackArgs[1], idx)
})

test('silencing remove events', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'this is a test'},
      callbackCalled = false,
      callbackArgs = []

  idx.on('remove', function (doc, index) {
    callbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.add(doc)
  idx.remove(doc.id, false)

  ok(!callbackCalled)
})

test('removing a non-existent document from the index', function () {
  var idx = new hummingbird.Index,
      doc1 = {id: 1, name: 'this is a test'},
      doc2 = {id: 2, name: 'i dont exist'},
      callbackCalled = false

  idx.on('remove', function (doc, index) {
    callbackCalled = true
  })

  equal(idx.metaStore.has(1), false)

  idx.add(doc1)
  equal(idx.metaStore.has(1), true)

  idx.remove(doc2.id)
  equal(idx.metaStore.has(2), false)

  ok(!callbackCalled)
})

test('updating a document', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'foo'}

  idx.add(doc)
  ok(idx.tokenStore.has('foo'))

  doc.name = 'bar'
  idx.update(doc)

  ok(idx.tokenStore.has('bar'))
})

test('emitting update events', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'foo'}
      addCallbackCalled = false,
      removeCallbackCalled = false,
      updateCallbackCalled = false,
      callbackArgs = []

  idx.add(doc)
  ok(idx.tokenStore.has('foo'))

  idx.on('update', function (doc, index) {
    updateCallbackCalled = true
    callbackArgs = Array.prototype.slice.call(arguments)
  })

  idx.on('add', function () {
    addCallbackCalled = true
  })

  idx.on('remove', function () {
    removeCallbackCalled = true
  })


  doc.name = 'bar'
  idx.update(doc)

  ok(updateCallbackCalled)
  equal(callbackArgs.length, 2)
  deepEqual(callbackArgs[0], doc)
  deepEqual(callbackArgs[1], idx)

  ok(!addCallbackCalled)
  ok(!removeCallbackCalled)
})

test('silencing update events', function () {
  var idx = new hummingbird.Index,
      doc = {id: 1, name: 'foo'}
      callbackCalled = false

  idx.add(doc)
  ok(idx.tokenStore.has('foo'))

  idx.on('update', function (doc, index) {
    callbackCalled = true
  })

  doc.name = 'bar'
  idx.update(doc, false)

  ok(!callbackCalled)
})
