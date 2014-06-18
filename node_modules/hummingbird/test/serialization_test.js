module('serialization', {
  setup: function () {
    this.corpus = [{
      id: 'a',
      title: 'Mr. Green kills Colonel Mustard',
      name: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.'
    },{
      id: 'b',
      title: 'Plumb waters plant',
      name: 'Professor Plumb has a green plant in his study'
    },{
      id: 'c',
      title: 'Scarlett helps Professor',
      name: 'Miss Scarlett watered Professor Plumbs green plant while he was away from his office last week.'
    }]
  }
})

test('dumping and loading an index', function () {
  var idx = new hummingbird.Index

  idx.tokenizer = new hummingbird.tokenizer(3,6)

  this.corpus.forEach(function (doc) { idx.add(doc) })

  var dumpedIdx = JSON.stringify(idx),
      clonedIdx = hummingbird.Index.load(JSON.parse(dumpedIdx))

  clonedIdx.tokenizer = new hummingbird.tokenizer(3,6)
  var set1 = idx.search('green plant', function (results) {return results})
  var set2 = clonedIdx.search('green plant', function (results) {return results})

  deepEqual(set1, set2)
})
