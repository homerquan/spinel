### About
Etch is a content editor built on Backbone.js and is designed to be easily plugged into your Backbone app or stand alone.

### Include Dependencies

Etch depends on [jQuery](http://jquery.com), [Underscore](http://underscorejs.com), [Backbone](http://backbonejs.com), as well as [Rangy](http://code.google.com/p/rangy/) if you need support for legacy browsers (IE8 and prior).

_You can exclude Rangy and shave 41k off of your footprint if you don't need legacy support._

Once you have the dependencies squared away simply include the etch.js script after them and before the script where you define your Models/Views.

At this point your scripts section should look something like this:

```
  <!-- dependencies -->
  <script src="/media/scripts/lib/jquery.js"></script>
  <script src="/media/scripts/lib/underscore.js"></script>
  <script src="/media/scripts/lib/backbone.js"></script>

  <!-- etch -->
  <script src="/media/scripts/etch/scripts/etch.js"></script>

  <!-- Your code -->
  <script src="/media/scripts/article.js"></script>
```

_Ensure that your scripts are in the right order or everything will likely be broken._

Also you need to add etch.css to your stylesheets
```
  <link rel="stylesheet" href="/media/scripts/etch/styles/etch.css" />
```

### Building The Model

This part is simple, we just define a model and give it a url and some defaults. Your model will probably end up being more complex but this is all it takes to get Etch working.

```
  var article = Backbone.Model.extend({
    url: '/some/api/url/',

    defaults: {
      title: 'Default Title',
      body: 'Default body text'
    }
  });
```

### Building The View

Basically all we need to do is call `etch.editableInit` when a user clicks (mousedown) on an editable element. Because of how backbone delegates events we need to call an intermediate function, `editableClick`, which references `etch.editableInit`.

```
  var articleView = Backbone.View.extend({
    events: {
      'mousedown .editable': 'editableClick'
    },

    editableClick: etch.editableInit
  });
```

etch.editableInit handles everything else for you except for saving. Etch will trigger a 'save' event on your model when the save button is clicked. All we need to do is listen for it by adding a binding to the view like so:

```
  var articleView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'save');
      this.model.bind('save', this.model.save);
    },
        
    events: {
      'mousedown .editable': 'editableClick'
    },

    editableClick: etch.editableInit
  });
```

### Customizing

You may have noticed that the demo had different buttons in the editor widget depending on if you were editing the body or the title. Etch allows you to customize which buttons to show on a given 'editable' by adding a `data-button-class` attribute to the element.

The default classes are:

```
  etch.config.buttonClasses = {
    'default': ['save'],
    'all': ['bold', 'italic', 'underline', 'unordered-list', 'ordered-list', 'link', 'clear-formatting', 'save'],
    'title': ['bold', 'italic', 'underline', 'save']
  };
```

_The 'default' button class will be used if no button class is defined on the element._

Defining your own button classes can be accomplished by extending `etch.config.buttonClasses`. Here we override 'default' to add more buttons and add a 'caption' class.
```
  _.extend(etch.config.buttonClasses, {
    'default': ['bold', 'italic', 'underline', 'save'],
    'caption': ['bold', 'italic', 'underline', 'link', 'save']
  });
```

_The order of buttons in the array is how they will be presented in the editor widget._

If the class '.editable' causes conflicts for you or you need to change it for any reason you can do so by setting `etch.config.selector`.

```
  etch.config.selector = '.my-new-editable-class';
```

All functions are public and can be overridden to customize functionality

For instance, if you want to create a custom popup for the link url prompt:

```
  etch.views.Editor.prototype.urlPrompt = function(callback) {
    // Custom popup code to get url
    callback(url)
  }
```
