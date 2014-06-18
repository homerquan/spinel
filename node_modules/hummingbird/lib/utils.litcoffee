## Utils
Collection of utility functions

    hummingbird.Utils = () ->
      @root = {}
      return

### ::warn
logs a warning message to the console

    hummingbird.Utils::warn = (message) ->
      console.warn message if console.warn

### .debugLog
logs a debug message to the console

    hummingbird.Utils::debugLog = (msg) ->
      if console.log and hummingbird.loggingOn
        console.log "#{msg}"

### .logTiming
logs a message to the console preceded by time of day

    hummingbird.Utils::logTiming = (msg, s) ->
      if console.log and hummingbird.loggingOn
        d = new Date()
        if s?
          console.log "#{d.toTimeString().split(' ')[0]}.#{d.getMilliseconds()} - #{msg} in #{d-s} ms"
        else
          console.log "#{d.toTimeString().split(' ')[0]}.#{d.getMilliseconds()} - #{msg}"
        return d

### .normalizeString
takes a string and normalizes it for case and diacritics

    hummingbird.Utils::normalizeString = (str) ->
      re_start = /^\u0002/
      str = diacritics.remove((str.toString()).toLowerCase())
      str = str.replace re_start, ''
      return '\u0002' + str

### .maxScore
Returns the max score for a given string

    hummingbird.Utils::maxScore = (phrase, tokenizer, prefixBoost) ->
      score = 0
      return score if not phrase?
      (tokenizer.tokenize phrase).forEach ((token, i, tokens) ->
        score += @tokenScore(token, false, prefixBoost)
      ), this
      return score

### .tokenScore
Returns the score for the given token

    hummingbird.Utils::tokenScore = (token, isVariant, prefixBoost) ->
      isVariant ?= false
      prefixBoost ?= true
      score = token.length
      score += 0.2 if prefixBoost and token.substring(0,1) is '\u0002'
      score -= 0.4 if isVariant
      return score
