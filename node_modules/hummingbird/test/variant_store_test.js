module('hummingbird.VariantStore')

test('get variant tokens', function () {
  var variants = {'steve': ['steven', 'stephen', 'stefan']}
  var store = new hummingbird.VariantStore(variants)
  var tokenizer = new hummingbird.tokenizer(3)
  var doc1 = {id:'123', name: 'steve'}
  var doc2 = {id:'456', name: 'stephen'}

  d1_tokens = store.getVariantTokens(doc1.name, tokenizer, ['\u0002st','ste','tev','eve','ve\u0003'])
  d2_tokens = store.getVariantTokens(doc2.name, tokenizer, ['\u0002st','ste','tep','eph','phe','hen','en\u0003'])

  deepEqual(d1_tokens,['ven','tep','eph','phe','hen','tef','efa','fan'])
  deepEqual(d2_tokens,[])
})

test('serialization', function () {
  var store = new hummingbird.VariantStore
  store.variants = {'steve': ['steven', 'stephen', 'stefan']}

  deepEqual(store.toJSON(),
     {
       variants: {
         "steve": [ "steven", "stephen", "stefan" ]
       }
     }
  )
})
