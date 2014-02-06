// SearchCardsView.js
// -------
define(["jquery", "backbone", "collections/SearchCardsCollection", "views/SearchCardItemView"],

    function($, Backbone, SearchCardsCollection, SearchCardItemView) {

        var View = Backbone.View.extend({

            el: "#find-results",
            tagName: "div",
            className: "autocomplete",
            wait: 300,
            queryParameter: "q",
            minKeywordLength: 2,
            currentText: "",
            itemView: SearchCardItemView,


            initialize: function(options) {
                _.extend(this, options);
                var query = this.query || '';
                this.collection = new SearchCardsCollection({
                    query: query
                });
                this.filter = _.debounce(this.filter, this.wait);
            },

            render: function() {
                // disable the native auto complete functionality
                this.input.attr("autocomplete", "off");

                this.$el.width(this.input.outerWidth());

                this.input
                    .keyup(_.bind(this.keyup, this))
                    .keydown(_.bind(this.keydown, this));

                return this;
            },

            keydown: function(event) {
                if (event.keyCode == 38) return this.move(-1);
                if (event.keyCode == 40) return this.move(+1);
                if (event.keyCode == 13) return this.onEnter();
                if (event.keyCode == 27) return this.hide();
            },

            keyup: function() {
                var keyword = this.input.val();
                if (this.isChanged(keyword)) {
                    if (this.isValid(keyword)) {
                        this.filter(keyword);
                    } else {
                        this.hide()
                    }
                }
            },

            transform: function() {
                if(this.input.hasClass('big-find')){
                    this.input.removeClass('big-find');
                    this.smallInputContainer.append(this.input); //move input into header
                }
            },

            filter: function(keyword) {
                var keyword = keyword.toLowerCase();
                if (this.collection.url) {

                    var parameters = {};
                    parameters[this.queryParameter] = keyword;
                    this.collection.fetch({
                        success: function() {
                            this.transform();
                            this.loadResult(this.collection.models, keyword);
                        }.bind(this),
                        data: parameters
                    });

                } else {
                    this.transform();
                    this.loadResult(this.collection.filter(function(model) {
                        return model.label().toLowerCase().indexOf(keyword) !== -1
                    }), keyword);
                }
            },

            isValid: function(keyword) {
                return keyword.length > this.minKeywordLength
            },

            isChanged: function(keyword) {
                return this.currentText != keyword;
            },

            move: function(position) {
                var current = this.$el.children(".active"),
                    siblings = this.$el.children(),
                    index = current.index() + position;
                if (siblings.eq(index).length) {
                    current.removeClass("active");
                    siblings.eq(index).addClass("active");
                }
                return false;
            },

            onEnter: function() {
                this.$el.children(".active").click();
                return false;
            },

            loadResult: function(model, keyword) {
                this.currentText = keyword;
                this.show().reset();
                if (model.length) {
                    _.forEach(model, this.addItem, this);
                    this.show();
                } else {
                    this.hide();
                }
            },

            addItem: function(model) {
                this.$el.append(new this.itemView({
                    model: model,
                    parent: this
                }).render().$el);
            },

            select: function(model) {
                var label = model.label();
                this.input.val(label);
                this.currentText = label;
                this.onSelect(model);
            },

            reset: function() {
                this.$el.empty();
                return this;
            },

            hide: function() {
                this.$el.hide();
                return this;
            },

            show: function() {
                this.$el.show();
                return this;
            },

            // callback definitions
            onSelect: function() {}

        });

        // Returns the View class
        return View;

    }

);