## Tokenizer
A flexible ngram tokenizer that can index a string using a range of lengths
for substrings suitable for autocomplete indexing and fuzzy name matching

### constructor

    hummingbird.tokenizer = (min, max) ->
      @utils = new hummingbird.Utils
      if not arguments.length or not min? or typeof min isnt 'number' or min < 1
        @min = 3
      else
        @min = min

      if arguments.length < 2 or not max? or typeof max isnt 'number' or max < min
        @max = @min
      else
        @max = max
      return

### ::tokenize
Splits a string into ngram tokens

To boost prefix matches, a start character \u0002 is prepended to the string
and used in the ngrams. This causes a sequence of characters at the start of both
a search query and a sought term to more tightly match than a similar series of
characters elsewhere in sought terms.

See utils.normalizeString()

    hummingbird.tokenizer::tokenize = (name) ->
      norm_name = @utils.normalizeString name
      return [] unless norm_name?

      alltokens = {}
      n = @min

      while n <= @max
        if norm_name.length <= n
          alltokens[norm_name] = null
        else
          i = 0
          while i <= norm_name.length - n
            alltokens[norm_name.slice(i, i + n)] = null
            i++
        n++
      return Object.keys(alltokens)
