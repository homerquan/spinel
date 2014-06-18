// SearchCardsView.js
// -------
define(["jquery", "backbone", "collections/GenericCollection",
        "./BaseView", "views/SearchCardItemView"
    ],

    function($, Backbone, Collection,
        BaseView, SearchCardItemView) {

        var View = BaseView.extend({

            el: "#find-results",
            tagName: "div",
            className: "autocomplete",
            wait: 300,
            queryParameter: "q",
            minKeywordLength: 2,
            currentText: "",
            itemView: SearchCardItemView,


            initialize: function(context) {
                _.extend(this, context);
                this.collection = new Collection({
                    query: "search"
                });
                this.filter = _.debounce(this.filter, this.wait);
                if (this.query) {
                    this.filter(this.query);
                    this.input.attr("placeholder", this.query);
                }
            },

            events: {
                "click .tag": "showTopic",
                "click .work-on-project": "lunchProject"
            },

            showTopic: function(e) {
                e.stopPropagation();
                var topic = {
                    "id": e.currentTarget.getAttribute('data-topic-id'),
                    "name": e.currentTarget.getAttribute('data-topic-name')
                };
                this.pubsub.trigger("action:showGraph", topic);
            },

            lunchProject: function(e) {
                e.stopPropagation();
                var id = e.currentTarget.getAttribute('data-project-id');
                Backbone.history.navigate(id, {
                    trigger: true
                });
            },

            render: function() {
                // disable the native auto complete functionality
                this.input.attr("autocomplete", "off");

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
                        this.hide();
                    }
                }
            },

            updateSearchUrl: function(query) {
                Backbone.history.navigate('search/' + query);
            },

            filter: function(origKeyword) {
                var keyword = origKeyword.toLowerCase();
                if (this.collection.url) {

                    var parameters = {};
                    parameters[this.queryParameter] = keyword;
                    this.collection.fetch({
                        success: function() {
                            this.updateSearchUrl(keyword);
                            this.loadResult(this.collection.models, keyword);
                        }.bind(this),
                        data: parameters
                    });

                } else {
                    this.loadResult(this.collection.filter(function(model) {
                        return model.label().toLowerCase().indexOf(keyword) !== -1;
                    }), keyword);
                }
            },

            isValid: function(keyword) {
                return keyword.length > this.minKeywordLength;
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