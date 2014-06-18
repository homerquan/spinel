// arbor renderer 
define(["jquery", "arbor"],
    function($, arbor) {
        Renderer = function(canvasElem) {
            var canvas = $(canvasElem).get(0);
            var ctx = canvas.getContext("2d");
            var particleSystem;
            var hoveredNode;

            var that = {
                init: function(system) {
                    //
                    // the particle system will call the init function once, right before the
                    // first frame is to be drawn. it's a good place to set up the canvas and
                    // to pass the canvas size to the particle system
                    //
                    // save a reference to the particle system for use in the .redraw() loop
                    particleSystem = system;

                    // inform the system of the screen dimensions so it can map coords for us.
                    // if the canvas is ever resized, screenSize should be called again with
                    // the new dimensions
                    particleSystem.screenSize(canvas.width, canvas.height);
                    particleSystem.screenPadding(22, 120, 22, 22); // leave an extra 80px of whitespace per side

                    // set up some event handlers to allow for node-dragging
                    that.initMouseHandling();
                },

                redraw: function() {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    particleSystem.eachEdge(function(edge, pt1, pt2) {
                        ctx.strokeStyle = "#1fb2f9";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);
                        ctx.stroke();
                        // edge text 
                        // ctx.fillStyle = "grey";
                        // ctx.font = 'italic 13px sans-serif';
                        // ctx.fillText(edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);

                    });

                    particleSystem.eachNode(function(node, pt) {
                        var w = (node.data.selected) ? 10 : 6;
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, w, 0, 2 * Math.PI, false);
                        ctx.fillStyle = (node.hovered) ? "#1fb2f9" : "black";
                        ctx.fill();
                        ctx.lineWidth = (node.data.selected) ? 5 : 3;
                        ctx.strokeStyle = '#1fb2f9';
                        ctx.stroke();
                        ctx.fillStyle = "white";
                        ctx.font = 'bold 15px sans-serif';
                        //wrap text to save space
                        that.wrapText(ctx, node.data.label || '', pt.x + 2 * w, pt.y + w / 2, 100, 14);
                    });
                },

                wrapText: function(context, text, x, y, maxWidth, lineHeight) {
                    var words = text.split(" ");
                    var line = "";
                    for (var n = 0; n < words.length; n++) {
                        var testLine = line + words[n] + " ";
                        var metrics = context.measureText(testLine);
                        var testWidth = metrics.width;
                        if (testWidth > maxWidth) {
                            context.fillText(line, x, y);
                            line = words[n] + " ";
                            y += lineHeight;
                        } else {
                            line = testLine;
                        }
                    }
                    context.fillText(line, x, y);
                },

                initMouseHandling: function() {
                    // no-nonsense drag and drop (thanks springy.js)
                    var dragged = null;

                    // set up a handler object that will initially listen for mousedowns then
                    // for moves and mouseups while dragging
                    var handler = {
                        moved: _.throttle(function(e) {
                                var pos = $(canvas).offset();
                                _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
                                nearest = particleSystem.nearest(_mouseP);

                                if (!nearest.node) return false;
                                return false;
                            },
                            500),
                        clicked: function(e) {
                            var pos = $(canvas).offset();
                            _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
                            dragged = particleSystem.nearest(_mouseP);
                            if ((dragged.distance < 50) && dragged.node.name) {
                                // resed hovered node
                                if (hoveredNode) {
                                    hoveredNode.hovered = false;
                                }
                                hoveredNode = dragged.node;
                                hoveredNode.hovered = true;

                                $.event.trigger({
                                    type: "GraphHoverTopic",
                                    topic: {
                                        id: dragged.node.name,
                                        name: dragged.node.data.label
                                    }
                                });
                            }
                            if (dragged && dragged.node !== null) {
                                // while we're dragging, don't let physics move the node
                                dragged.node.fixed = true;
                            }

                            $(canvas).bind('mousemove', handler.dragged);
                            $(window).bind('mouseup', handler.dropped);

                            return false;
                        },
                        dragged: function(e) {
                            var pos = $(canvas).offset();
                            var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);

                            if (dragged && dragged.node !== null) {
                                var p = particleSystem.fromScreen(s);
                                dragged.node.p = p;
                            }

                            return false;
                        },

                        dropped: function(e) {
                            if (dragged === null || dragged.node === undefined) return;
                            if (dragged.node !== null) dragged.node.fixed = false;
                            dragged.node.tempMass = 1000;
                            dragged = null;
                            $(canvas).unbind('mousemove', handler.dragged);
                            $(window).unbind('mouseup', handler.dropped);
                            _mouseP = null;
                            return false;
                        }
                    };

                    // start listening
                    $(canvas).mousedown(handler.clicked);
                    $(canvas).mousemove(handler.moved);

                }

            };
            return that;
        };

        return Renderer;

    }
);