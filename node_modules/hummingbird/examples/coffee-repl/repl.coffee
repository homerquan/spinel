# CLI Example
# You can just 'require' hummingbird if you run it locally via terminal or in a node.js app
hummingbird = require '../../hummingbird'
fs = require 'fs'
prompt = require 'prompt'
countries = require '../raw-countries.json'

localIndex = "idx-countries.json"

justBuild = if process.argv.indexOf('exit') > -1 then true else false

# In this case, we'll build an autocomplete on item names.  Serialize the index out to disk if so desired.
buildIndex = (data) ->
  for item in data
    # indexed 'documents' must be a hash with id, name (thing to be tokenized) as required properties
    # any other arbitrary hash of name-value pairs will be stored but not tokenized
    index.add
      id: item.numeric_code,
      name: item.country
      code2: item.alpha_2_code
      code3: item.alpha_3_code
      lat: item.latitude_average
      long: item.longitude_average
  fs.writeFileSync localIndex, JSON.stringify(index.toJSON(), null, '\t')

# Just print them out using console.log
printResults = (results) ->
  console.log "\n"
  for result in results
    console.log "\t#{result.name} (#{result.code3}) \n\t\t>> lat: #{result.lat} / lon: #{result.long}\n"
  console.log "\n"

# search for some string
# Keep searching until you wish to search no more
search = (err, arg) ->
  return false if arg.q is 'exit'
  serializedindex.search arg.q, printResults
  prompt.get ['q'], search

# Build & Serialize Index
hummingbird.loggingOn = true

variants =
  'great britain': ['united kingdom', 'britain', 'uk', 'u.k.', 'england']
  'britain':['united kingdom','great britain','uk','england']
  'united kingdom':['britain','great britain','uk','england']
  'uk':['united kingdom','britain','great britain','england']
  'england':['united kingdom','britain','great britain','uk']
  'United States': ['america', 'usa']
  'usa': ['United States', 'america']
  'america': ['united states', 'usa', 'america']
  'russia': ['russian federation', 'soviet union', 'ussr']
  'russian federation': ['russia', 'soviet union', 'ussr']
  'ussr': ['russian federation', 'soviet union', 'russia']
  'soviet union': ['russian federation', 'ussr', 'russia']

index = new hummingbird variants

index.tokenizer = new hummingbird.tokenizer(3)
buildIndex(countries)
process.exit() if justBuild

# Load & Search Index
serializedindex = hummingbird.Index.load(JSON.parse(fs.readFileSync localIndex, ['utf8']))
prompt.message = "Enter query (or 'exit' to quit)"
prompt.start()
prompt.get ['q'], search
