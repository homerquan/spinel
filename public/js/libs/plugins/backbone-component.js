// Backbone.Component v0.2.3
// (c) 2015 Oleg Kalistratov, for SourceTalk project (http://sourcetalk.net)
// Distributed Under MIT License

(
    function ( factory ) {
        if ( ( typeof define === "function" ) && ( define.amd ) ) {
            // AMD. Register as an anonymous module.
            define( [ "underscore", "backbone" ] ,
                    factory                      );
        } else {
            // Browser globals
            factory( _, Backbone );
        }
    }(
        function( _, Backbone ) {
            "use strict";

            var namespace          = Backbone.Components;
            var baseViewClass      = Backbone.View;
            var transformHTML      = null;
            var observedSelectors  = { };
            var activeComponents   = { };

            var observe = function( selector, componentClass ) {
                observedSelectors[ selector ] ||
                    ( observedSelectors[ selector ] = componentClass );
            };

            var toComponentClass = function( componentName ) {
                var cls = null;

                if ( _.isArray( namespace ) ) {
                    _.each(
                        namespace ,
                        function( ns ) {
                            cls || ( cls = ns[ componentName ] );
                        }
                    );
                } else {
                    cls = namespace[ componentName ];
                }

                return cls;
            };

            var toClassName = function( componentName ) {
                return _.result( toComponentClass( componentName ).
                                 prototype                          ,
                                 "className"                        ) || (
                           "component-" +
                           componentName.
                           replace( /([A-Z])/g, "-$1" ).
                           replace( /^\-+/, "" ).
                           toLowerCase( )
                       );
            };

            var register = function( componentName ) {
                var cls       = toComponentClass( componentName );
                var selector  = "." + toClassName( componentName );
                var cmpProto  = cls.prototype;
                var viewProto = baseViewClass.prototype;

                if ( cls.prototype instanceof Backbone.Component ) {
                    observe( selector, cls );
                }

                viewProto[ "insert" + componentName ] = function( ) {
                    var res       = "";
                    var wrapper   =
                        ( _.last( arguments ) || { } )[ "wrapper" ] || { };
                    var tagName   = _.result( cmpProto, "tagName" ) || "span";
                    var id        =
                        wrapper[ "htmlId" ]                               ||
                        _.result( cmpProto, "id" )                        ||
                        _.uniqueId( toClassName( componentName ) + "-" );
                    var className =
                        ( wrapper[ "htmlClass" ] || "" ) +
                        " "                              +
                        toClassName( componentName );

                    res = cmpProto.generate.apply( cmpProto , arguments );
                    res = template(
                        {
                            "html"          : res       ,
                            "tagName"       : tagName   ,
                            "className"     : className ,
                            "id"            : id
                        }
                    );

                    if ( _.isFunction( transformHTML ) ) {
                        res = transformHTML.call( this, res );
                    }

                    return res;
                };
            };

            var componentObserver = new MutationObserver(
                function( mutations ) {
                    // First, look for untracked elements
                    _.each(
                        observedSelectors ,
                        function( componentClass, selector ) {
                            var elements =
                                document.querySelectorAll(
                                    selector + ":not(.component-active)"
                                );

                            _.each(
                                elements ,
                                function( el ) {
                                    var component = new componentClass;
                                    var id        = component.cid;

                                    component.setElement( el );
                                    component.activate( );
                                    activeComponents[ id ] = component;
                                    el.className += " component-active";
                                    el.setAttribute( "data-component-id", id );
                                }
                            );
                        }
                    );

                    // Now, look for removed elements
                    _.each(
                        activeComponents ,
                        function( component ) {
                            var el = component.el;

                            if ( !document.body.contains( el ) ) {
                                el.setAttribute( "data-component-id" ,
                                                 null                );
                                el.className =
                                    _.chain( el.className.split( /\s/ ) ).
                                    compact( ).
                                    without( "component-active" ).
                                    value( ).
                                    join( " " );
                                component.undelegateEvents( );
                                component.stopListening( );
                                component.deactivate( );
                                component.el = null;
                                delete activeComponents[ component.cid ];
                            }
                        }
                    );
                }
            );

            var template = _.template(
                "<<%= tagName %> class=\"<%= className %>\" id=\"<%= id %>\">" +
                "<%= html %>"                                                  +
                "</<%= tagName %>>"
            );

            Backbone.Helper = function( ) {
                this.cid = _.uniqueId( "component-" );
                this.initialize.apply( this, arguments );
            };

            _.extend(
                Backbone.Helper.prototype ,
                {
                    initialize: function( ) {
                    } ,

                    generate:   function( ) {
                        return "";
                    }
                }
            );

            Backbone.Helper.extend = Backbone.Model.extend;

            Backbone.Component = Backbone.Helper.extend(
                {
                    activate:   function( ) {
                    } ,

                    deactivate: function( ) {
                    }
                }
            );

            _.extend(
                Backbone.Component.prototype ,
                Backbone.Events              ,
                _.pick(
                    Backbone.View.prototype ,
                    "$"                     ,
                    "setElement"            ,
                    "delegateEvents"        ,
                    "undelegateEvents"
                )
            );

            Backbone.Component.VERSION  = "0.2.3";

            Backbone.Component.initialize = function( options ) {
                var initNS = function( ns ) {
                    _.each(
                        ns ,
                        function( v, k ) {
                            if ( ( typeof( v ) === "function"             ) &&
                                 ( v.prototype instanceof Backbone.Helper ) ) {
                                register( k );
                            };
                        }
                    );
                };

                options || ( options = { } );

                namespace     = options[ "namespace"     ] || namespace;
                baseViewClass = options[ "baseViewClass" ] || baseViewClass;
                transformHTML = options[ "transformHTML" ] || transformHTML;

                if ( _.isArray( namespace ) ) {
                    _.each( namespace, initNS );
                } else {
                    initNS( namespace );
                }

                componentObserver.observe(
                    document.body ,
                    {
                        "childList" : true ,
                        "subtree"   : true
                    }
                );
            };
        }
    )
);
