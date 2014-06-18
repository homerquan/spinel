module('hummingbird.TokenStore')

test('adding a token to the store', function () {
  var store = new hummingbird.TokenStore,
      docId = '123',
      token = 'foo'

  store.add(token, false, docId)

  ok(store.root['foo'].n.indexOf('123') === 0)
  equal(Object.keys(store.root['foo'].n).length, 1)
})

test('adding another document to the token', function () {
  var store = new hummingbird.TokenStore,
      doc1 = '123',
      doc2 = '456',
      token = 'foo'

  store.add(token, false, doc1)
  store.add(token, false, doc2)

  ok(Object.keys(store.root).length === 1)
  equal(Object.keys(store.root)[0], 'foo')
  ok(store.root['foo'].n.indexOf('123') > -1)
  ok(store.root['foo'].n.indexOf('456') > -1)
})

test('checking if a token exists in the store', function () {
  var store = new hummingbird.TokenStore,
      doc = '123',
      token = 'foo'

  store.add(token, doc)

  ok(store.has(token))
})

test('checking if a token does not exist in the store', function () {
  var store = new hummingbird.TokenStore,
      doc = '123',
      token = 'foo'

  ok(!store.has('bar'))
  store.add(token, doc)
  ok(!store.has('bar'))
})

test('retrieving items from the store', function () {
  var store = new hummingbird.TokenStore,
      doc = '123',
      token = 'foo'

  store.add(token, false, doc)
  deepEqual(store.get(token), ['123'])
  deepEqual(store.get(''),[])
})

test('retrieving items that do not exist in the store', function () {
  var store = new hummingbird.TokenStore

  deepEqual(store.get('foo'), [])
})

test('counting items in the store', function () {
  var store = new hummingbird.TokenStore,
      doc1 = '123',
      doc2 = '456',
      doc3 = '789'

  store.add('foo', false, doc1)
  store.add('foo', true, doc2)
  store.add('bar', false, doc3)

  equal(store.count('foo'), 2)
  equal(store.count('bar'), 1)
  equal(store.count('baz'), 0)
})

test('removing a document from the token store', function () {
  var store = new hummingbird.TokenStore,
      doc = '123'

  deepEqual(store.get('foo'), [])
  store.add('foo', false, doc)
  deepEqual(store.get('foo'), ['123'])

  store.remove(doc)
  deepEqual(store.get('foo'), [])
  equal(store.has('foo'), false)
})

test('removing a document that is not in the store', function () {
  var store = new hummingbird.TokenStore,
      doc1 = '123',
      doc2 = '567'

  store.add('foo', false, doc1)
  store.add('bar', true, doc2)
  store.remove('456')

  deepEqual(store.get('foo'), ['123'])
})

test('removing a document from a key that does not exist', function () {
  var store = new hummingbird.TokenStore

  store.remove('123')
  ok(!store.has('foo'))
})

test('serialization', function () {
  var store = new hummingbird.TokenStore

  //deepEqual(store.toJSON(), { root: { docs: {} }, length: 0 })
  deepEqual(store.toJSON(), { root: {} })

  store.add('foo', false, '123')

  deepEqual(store.toJSON(),
    {
      root: {
        foo: {
          n: ['123']
        }
      }
    }
  )
})

test('loading a serialized store', function () {
  var serializedData = {
    root: {
      foo: {
        n: [123]
      }
    }
  }

  var store = hummingbird.TokenStore.load(serializedData),
      documents = store.get('foo')

  //equal(store.length, 1)
  deepEqual(documents, [123])
})
