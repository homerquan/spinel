# VariantStore
A collection of objects and methods for working with names and their variants (i.e., nicknames)

### constructor
_@variants_ - key is name, value is array of nicknames/variants

    hummingbird.VariantStore = (variantsObj) ->
      @variants = {}
      @utils = new hummingbird.Utils
      if variantsObj?
        for name of variantsObj
          norm_name = @utils.normalizeString(name)
          @variants[norm_name] = []
          variantsObj[name].forEach ((variant, i, variants) ->
            normVariant = @utils.normalizeString(variant)
            @variants[norm_name].push normVariant
          ), this
      return

### .load
Loads a previously serialized variant store

    hummingbird.VariantStore.load = (serializedData) ->
      store = new this
      store.variants = if serializedData.hasOwnProperty 'variants' then serializedData.variants
      store

### ::toJSON
Returns a representation of the variant store ready for serialization.

    hummingbird.VariantStore::toJSON = ->
      variants: @variants

### ::getVariantTokens
Returns tokens associated with variants of the provided name
that would not otherwise be associated with the provided name.

    hummingbird.VariantStore::getVariantTokens = (name, tokenizer, tokens) ->
      matched_variants = []
      variant_tokens = {}
      norm_name = @utils.normalizeString name

      return variant_tokens if not norm_name? or norm_name is `undefined`

      # first check to see if the norm_name has variants
      if @variants.hasOwnProperty norm_name
        @variants[norm_name].forEach ((variant, i, variants) ->
          for token in tokenizer.tokenize(variant)
            variant_tokens[token] = null if tokens.indexOf(token) == -1
        ), this

      # then split the full name on word boundaries and check each name part
      unless norm_name is norm_name.split(/\s+/)[0]
        norm_name.split(/\s+/).forEach ((name_part, j, names) ->
          # check each name word for any nicknames/variants
          if @variants.hasOwnProperty name_part
            @variants[name_part].forEach ((variant, i, variants) ->
              for token in tokenizer.tokenize(variant)
                variant_tokens[token] = null if tokens.indexOf(token) == -1
            ), this
        ), this

      return Object.keys(variant_tokens)
