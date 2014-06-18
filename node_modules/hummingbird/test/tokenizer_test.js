module('hummingbird.tokenizer')

test("splitting a string into 2-grams", function () {
  var tokenizer = new hummingbird.tokenizer(2);
  var tokens = tokenizer.tokenize("simple string");
  deepEqual(tokens, ["\u0002s", "si", "im", "mp",
            "pl", "le", "e ", " s", "st", "tr",
            "ri", "in", "ng"]);
})

test("splitting a string into 3-grams", function() {
  var tokenizer = new hummingbird.tokenizer(3);
  var tokens = tokenizer.tokenize("simple string");
  deepEqual(tokens, ["\u0002si", "sim", "imp", "mpl",
            "ple", "le ", "e s", " st", "str", "tri",
            "rin", "ing"]);
})

test("downcases all tokens", function() {
  var tokenizer = new hummingbird.tokenizer(3);
  var tokens = tokenizer.tokenize("AlEiN");
  deepEqual(tokens, ["\u0002al", "ale", "lei", "ein"]);
})

test("does not exclude characters", function () {
  var tokenizer = new hummingbird.tokenizer(3);
  var tokens = tokenizer.tokenize("!@#$%");
  deepEqual(tokens, ["\u0002!@", "!@#", "@#$", "#$%"]);
})

test("splitting a string into multiple n-grams", function() {
  var tokenizer = new hummingbird.tokenizer(2,4);
  var tokens = tokenizer.tokenize("simple string");
  deepEqual(tokens, ["\u0002s", "si", "im", "mp",
            "pl", "le", "e ", " s", "st", "tr", "ri", "in", "ng",
            "\u0002si", "sim", "imp", "mpl", "ple", "le ", "e s", " st", "str",
            "tri", "rin", "ing", "\u0002sim", "simp", "impl",
            "mple", "ple ", "le s", "e st", " str", "stri", "trin", "ring"]);
})
