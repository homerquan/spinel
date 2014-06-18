module('search', {
  setup: function () {
    var variants = {'scarlett': ['scar', 'scary', 'rouge']}
    var idx = new hummingbird.Index(variants)
    idx.tokenizer = new hummingbird.tokenizer(3)

    ;([{
      id: 'a',
      name: 'Mr. Green killed Colonel Mustard in the study with the candlestick. Mr. Green is not a very nice fellow.',
      title: 'Mr. Green kills Colonel Mustard',
      wordCount: 19
    },{
      id: 'b',
      name: 'Professor Plumb has a green plant in his study',
      title: 'Plumb waters plant',
      wordCount: 9
    },{
      id: 'c',
      name: 'Miss Scary watered Professor Plumbs green plant while he was away from his office last week.',
      title: 'Scary helps Professor',
      wordCount: 16
    },{
      id: 'd',
      name: 'handsome',
      title: 'title'
    },{
      id: 'e',
      name: 'hand',
      title: 'title',
      company: 'foo bar llc'
    },{
      id: 'f',
      name: 'Scarlett Johnson',
      title: 'Mi Bambina',
      company: 'My Test Corp'
    }]).forEach(function (doc) {  idx.add(doc) })

    this.idx = idx
  }
})

test('return correct results - without variant', function () {
  this.idx.search('scarlett watered a green plant', function(results) {
    equal(results.length, 1)
    equal(results[0].id, 'c')
    equal(results[0].title, 'Scary helps Professor')
  });
})

test('return correct results - with variant', function () {
  this.idx.search('Rouge ', function(results) {
    equal(results.length, 1)
    equal(results[0].id, 'f')
    equal(results[0].score, 10.6)
    equal(results[0].title, 'Mi Bambina')
  }, {'scoreThreshold':0});
})

test('return correct results - default options', function () {
  this.idx.search('green plant', function(results) {
    equal(results.length, 2)
    equal(results[0].id, 'c')
    equal(results[1].id, 'b')
    equal(results[0].title, 'Scary helps Professor')
    equal(results[0].wordCount, '16')
    equal(results[1].title, 'Plumb waters plant')
  });
})

test('return correct results - no boost, no threshold', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('green plant', function(results) {
    equal(results.length, 3)
    equal(results[0].id, 'c')
    equal(results[1].id, 'b')
    equal(results[2].id, 'a')
    equal(results[0].title, 'Scary helps Professor')
    equal(results[1].title, 'Plumb waters plant')
    equal(results[2].title, 'Mr. Green kills Colonel Mustard')
  }, options);
})

test('return correct results - howMany, no boost, no threshold', function () {
  var options = {"howMany":2, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('green plant', function(results) {
    equal(results.length, 2)
    equal(results[0].id, 'c')
    equal(results[1].id, 'b')
  }, options);
})

test('return correct results - with boost, no threshold', function () {
  var options = {"boostPrefix":true, "scoreThreshold":0};
  this.idx.search('hand', function(results) {
    equal(results.length, 3)
    equal(results[0].id, 'e')
    equal(results[1].id, 'd')
    equal(results[2].id, 'a')
    equal(results[0].score, '9.3')
    equal(results[1].score, '9.2')
    equal(results[2].score, '3')
  }, options);
})

test('return the correct results - with boost, with threshold', function () {
  options = {"boostPrefix":true, "scoreThreshold":.75};
  this.idx.search('hand', function(results) {
    equal(results.length, 2)
    equal(results[0].id, 'e')
    equal(results[1].id, 'd')
    equal(results[0].score, '9.3')
    equal(results[1].score, '9.2')
  }, options);
})

test('no search tokens in the index', 0, function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('zoo', function (results) {
    // no results returned, so nothing to do
  }, options);
})

test('search results ranked by score - default options', function () {
  this.idx.search('professor', function(results){
    equal(results.length, 2)
    equal(results[0].id, 'b')
    equal(results[1].id, 'c')
    equal(results[0].score, 24.2)
    equal(results[1].score, 21)
  });
})

test('search results ranked by score - modified options', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('professor', function(results){

    equal(results.length, 2)
    equal(results[0].id, 'b')
    equal(results[1].id, 'c')

    equal(results[0].score, 24)
    equal(results[1].score, 21)
  }, options);
})

test('search boosts exact matches', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('hand', function(results){

    equal(results.length, 3)
    equal(results[0].id, 'e')
    equal(results[1].id, 'd')
    equal(results[2].id, 'a')

    ok(results[0].score = results[1].score)
    ok(results[1].score > results[2].score)
  }, options);
})

test('search boosts full string matches', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('hand', function(results) {
    equal(results.length, 3)
    equal(results[0].id, 'e')
    equal(results[1].id, 'd')
    equal(results[2].id, 'a')
    equal(results[0].score, '9.1')
    equal(results[1].score, '9')
    equal(results[2].score, '3')
  }, options);

})

test('ngram search prefix matching', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('plu', function(results){

    equal(results.length, 2)
    equal(results[0].id, 'c')
    equal(results[1].id, 'b')
  }, options);
})

test('ngram search suffix matching', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('udy', function(results){

    equal(results.length, 2)
    equal(results[0].id, 'a')
    equal(results[1].id, 'b')

    ok(results[0].score = results[1].score)
  }, options);
})

test('ngram search query too short', 0, function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('y', function(results){
    // no results returned, so nothing to do
  }, options);
})

test('ngram search mid string phrase with typo', function () {
  var options = {"howMany":10, "boostPrefix":false, "scoreThreshold":0};
  this.idx.search('watered plant', function(results){

    equal(results[0].id, 'c')
  }, options);
})
