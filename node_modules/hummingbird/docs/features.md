## Features

### Search Options
Customizable _options_ javascript object can be passed into the
hummingbird.index.search method to tune various search-time
features.

_boostPrefix_ - (boolean) if _true_ provides an additional boost to results that start with the first 
  query token (_default=true_)

_scoreThreshold_ - (number between 0,1 inclusive) only matches with a score equal to or greater
  than this fraction of the maximum theoretical score will be returned in the result set (_default=0.5_, 
  includes all matches)

_howMany_ - the maximum number of results to be returned (_default=10_)

_startPos_ - how far into the sorted matched set should the returned resultset start (_default=0_)

```javascript
// example
var options = {
  'boostPrefix': false, 
  'scoreThreshold': 0.75, 
  'howMany': 5, 
  'startPos': 5
};
idx.search('bob', printResults(), options);
```

### Arbitrary Meta Data
To include a name in the hummingbird index, you pass the _add_ method a
'document' that is a javascript object with an arbitrary collection of key-value 
pairs.  This document must contain an 'id' key that is a unique identifier for this
document within a given index.

Additionally, choose one of the following two options in order to have something to search:

* _doc.name_ = this string will be indexed, unless _indexCallback_ is
provided
* _indexCallback_ = this function if provided will be called on _doc_ and must return
  the string to be indexed

All other key-value pairs wil be stored, but *not* indexed.
These additional key-value pairs are simply added to the index *as is* and returned as part of 
the result set. This makes it really easy to provide autosuggest on the name of
anything (e.g., a person, company, project description, email subject, 
whatever) AND display any additional metadata that provides additional
context to the user.  For example, you might include a person's current
employer, their title, geographic location, telephone number, email
address, etc.

### Ranking Across Indexes
Scoring results in response to a query is based soley on how
names are tokenized.  Therefore, as long as different indexes are tokenized in the
same way you can compare scores across them and rank documents by best
match regardless from which index they came.  Let's say you use
trigrams, for example, to build a person name index and a project name index.  Now
at search time you can allow your users to type into a single search box
and it will "magically understand" whether they're looking for a person
or a project (or both).  You can merge results into a single list or
denote them as different types of things.  You have all the
flexibility you need to provide the users what they need to streamline
their workflow.

### Name Variants
It is possible to supply a set of name variants (aka, nicknames; aka, synonyms)
for each index individually.  If a set of name variants is provided, searches for
alternate names will be displayed where appropriate.  The examples
include name variants for countries (e.g., _America_ as a variant for
_United States_).

In this example above, searches for _America_, _USA_, or _U.S.A._ will
return the documents with _United States_.  Searches for _United
States_, however, will **not** return documents with _America_.  This is
by design.  For the latter search, you would create a variant with
_America_ as the primary key and _United States_ as a nickname/variant.

```javascript
// example
var variants = {
      "United States": ["America","USA","U.S.A."],
      "America": ["United States"]
  }
var idx = new hummingbird.Index(variants);
```

