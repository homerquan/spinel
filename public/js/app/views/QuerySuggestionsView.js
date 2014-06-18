// QuerySuggestionsView.js
// -------
define(["jquery", "backbone", "models/GenericModel",
        "views/BaseView", "views/SuggestionTypeView"
    ],

    function($, Backbone, Model,
        BaseView, SuggestionTypeView) {

        var View = BaseView.extend({

            el: "#suggestion-results",
            partsEl: "#suggestion-parts",
            tagName: "div",
            className: "autocomplete",
            wait: 300,
            queryParameter: "q",
            minKeywordLength: 2,
            currentText: "",
            typeView: SuggestionTypeView,

            initialize: function(context) {
                _.extend(this, context);
                this.model = new Model({
                    query: "suggestion"
                });
                this.filter = _.debounce(this.filter, this.wait);
                if (this.query) {
                    this.filter(this.query);
                    this.input.attr("placeholder", this.query);
                }
                this.pubsub.on("action:reset-suggestion", this.reset, this);
            },

            events: {
                "click .more-projects": "showMoreProject",
                "click li": "showSelectedItem"
            },

            showMoreProject: function(e) {
                this.reset();
                Backbone.history.navigate('search/' + this.model.get("keyword"), {
                    trigger: true
                });
            },

            showSelectedItem: function(e) {
                this.reset();
                var id = e.currentTarget.getAttribute('data-id');
                Backbone.history.navigate(id, {
                    trigger: true
                });
            },

            showTopic: function(e) {
                e.stopPropagation();
                var topic = {
                    "id": e.currentTarget.getAttribute('data-topic-id'),
                    "name": e.currentTarget.getAttribute('data-topic-name')
                };
                this.pubsub.trigger("action:showGraph", topic);
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

            filter: function(origKeyword) {
                var keyword = origKeyword.toLowerCase();
                if (this.model.query) {
                    var parameters = {};
                    parameters[this.queryParameter] = keyword;
                    this.model.set('keyword', keyword);
                    this.model.fetch({
                        success: function() {
                            this.loadResult(this.model);
                        }.bind(this),
                        data: parameters
                    });

                } else {
                    this.loadResult(this.model.filter(function(model) {
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

            loadResult: function(model) {
                this.show().reset();
                if (Object.keys(model.attributes).length > 1) {
                    var projects = model.get("projects") || [];
                    var topics = model.get("topics") || [];
                    var people = model.get("people") || [];
                    if (projects.length > 0) {
                        this.addType(projects, "projects");
                    }
                    if (topics.length > 0) {
                        this.addType(topics, "topics");
                    }
                    if (people.length > 0) {
                        this.addType(people, "people");
                    }
                    this.show();
                } else {
                    this.hide();
                }
            },

            addType: function(model, type) {
                this.$el.append(new this.typeView({
                    type: type,
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