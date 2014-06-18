module('hummingbird.MetaStore')

test('adding empty meta object to the store', function () {
  var store = new hummingbird.MetaStore

  var doc = {
    id:'123',
    name: 'test'
  }
  store.add(doc)

  ok(store.root['123'] === doc)
})

test('adding meta object to the store', function () {
  var store = new hummingbird.MetaStore

  var doc = {
    id:'123',
    name: 'test',
    fname:'fred',
    lname:'smith',
    title: 'boss of the world'
  }
  store.add(doc)

  ok(store.root['123'] === doc)

  var obj = store.root['123']
  equal(obj['fname'], 'fred')
  equal(obj['lname'], 'smith')
  equal(obj['title'], 'boss of the world')
})


test('removing meta from the store', function () {
  var store = new hummingbird.MetaStore

  var doc = {
    id:'123',
    name: 'test',
    foo: 'bar'
  }
  store.add(doc)

  ok(store.root['123'] === doc)

  var docId = '123'
  store.remove(docId)

  ok(store.root['123'] === undefined)

})

test('retrieving empty meta from the store', function () {
  var store = new hummingbird.MetaStore

  var doc = {
    id:'123',
    name: 'test'
  }
  store.add(doc)

  ok(store.root['123'] === doc)

  var docId = '123'
  var doc = store.get(docId)

  ok(typeof doc === 'object')

})

test('retrieving meta object to the store', function () {
  var store = new hummingbird.MetaStore

  var doc = {
    id:'123',
    name: 'test',
    fname:'fred',
    lname:'smith',
    title: 'boss of the world'
  }
  store.add(doc)

  ok(store.root['123'] === doc)

  var docId = '123'
  var obj = store.get(docId)
  equal(obj['fname'], 'fred')
  equal(obj['lname'], 'smith')
  equal(obj['title'], 'boss of the world')
})
