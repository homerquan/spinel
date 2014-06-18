//UserDashBoardView
//Shared by all pages
//Use two sub view to simply unit

define(["jquery", "backbone", "./BaseView",
        "views/CreativityGraphView", "views/StudyComboView",
        "text!templates/user_dashboard.hbr"
    ],

    function($, Backbone, BaseView,
        CreativityGraphView, StudyComboView, template) {

        var View = BaseView.extend({

            el: "#overcanvas-container",
            hashName: "#topic-hash",
            className: "",
            template: Handlebars.compile(template),
            topic: null,

            initialize: function(context) {
                _.extend(this, context);
                if (this.session) {
                    this.session.bind('change', this.close, this);
                }
                // add notification subscription 
                this.pubsub.on("system:notify", function(notice) {
                    new $.pnotify({
                        title: 'Non-Blocking Notice',
                        text: 'I\'m a special kind of notice called "non-blocking". When you hover over me I\'ll fade to show the elements underneath. Feel free to click any of them just like I wasn\'t even here.\n\nNote: HTML links don\'t trigger in some browsers, due to security settings.',
                        nonblock: {
                            nonblock: true,
                            nonblock_opacity: 0.2
                        }
                    });
                });
            },

            events: {
                "click #close-overcanvas": "close"
            },


            render: function() {
                var genGraphQuery = function(id) {
                    return id + '?extends=graph';
                };
                var genComboQuery = function(id) {
                    return id + '?extends=contents,courses,acadamy,industry';
                };
                this.$el.html(this.template());
                //TODO, add hash tag 
                $(this.hashName, this.$el).html("#" + this.topic.name.toLowerCase());

                var that = this;
                _.defer(function() {
                    var graphView = new CreativityGraphView({
                        query: genGraphQuery(that.topic.id),
                        parent: that
                    }).render();

                    var comboView = new StudyComboView({
                        query: genComboQuery(that.topic.id),
                        parent: that
                    }); //render after model fetch

                    //jquery global event from creativity graph
                    $(document).on("GraphHoverTopic", function(e) {
                        if (e.topic.id !== that.topic.id) {
                            that.topic = e.topic;
                            // re-render projects and courses
                            $(that.hashName, that.$el).html("#" + that.topic.name.toLowerCase());
                            graphView.changeQuery(genGraphQuery(that.topic.id));
                            comboView.changeQuery(genComboQuery(that.topic.id));
                        }
                    });

                    // receive events from click topic tags
                    that.pubsub.on("action:showGraph", function(topic) {
                        $('#overcanvas-container').addClass('active');
                        $.event.trigger({
                            type: "GraphHoverTopic",
                            topic: topic
                        });
                    });
                });

                // var that = this;
                // this.pubsub.on('user:login', function() {
                //     that.$el.html(that.template());
                // });
                // this.pubsub.on('user:logout', function() {
                //     that.close();
                //     that.$el.html("");
                //     //TODO: clear event handlers
                // });
                return this;
            },

            close: function() {
                $('#overcanvas-container').removeClass('active');
            }
        });

        // Returns the View class
        return View;

    }

);