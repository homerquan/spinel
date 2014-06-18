## Inspiration

@@EXAMPLE

... it's _not_ [Lucene](https://lucene.apache.org/) _nor_ [ElasticSearch](http://www.elasticsearch.org/), _not_ [Solr](https://lucene.apache.org/solr/) _nor_ [Lunr](http://lunrjs.com/)

Inspired by the desire to help folks _get to_ what they want
_without leaving_ what they're doing.  Influenced by
popular search solutions as well as GLG's
[AutoComplete](https://github.com/glg/AutoComplete), Hummingbird's
goals are simple:

* Unlike other search solutions, focus strictly on names of
persons, places, and things for autocomplete, autosuggest,
and typeahead applications
* Prioritize speed and simplicity
* Enable finding near matches (e.g., substring matches, misspellings, nicknames)

To do this we decided to push as much processing as possible to the
browser and eliminate the latency and architectural complexity
introduced by server-side solutions.  Solutions like Lunr.js are
designed for full-text document search and we quickly realized that it would be no small feat to make it
scale and perform to the millions of names that we needed to support.

Thus, **Hummingbird.js** was born...

[MIT Licensed](./LICENSE)
