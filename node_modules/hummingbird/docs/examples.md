## Examples
Special thanks to [socrata.com](https://opendata.socrata.com/) for
making a wide range of interesting data available

### jquery
The most obvious way to use hummingbird.js is from within an html page.  
Here is an extremely simplistic [example of typeahead](examples/html-script/index.html)

### twitter typeahead
Here is an example of integrating hummingbird.js [with Twitter
  Typeahead](examples/html-script/twitter.html)

### coffee repl
Yep, you can even run this from the command-line.  This can be useful if
making changes to the code or if you simply want to experiment with the
data you are indexing or configuration parameters.

1. Clone the [repo](https://github.com/glg/hummingbird.js) or pull down
   just this
   [subdirectory](https://github.com/glg/hummingbird.js/tree/master/examples)
    
1. _$ npm install_

    from inside the ./coffee-repl subdirectory in order to get
    additional dependencies like _prompt_

1. _$ coffee repl.coffee_

    builds in memory index, serializes it out
    to disk, and displays interactive query prompt

