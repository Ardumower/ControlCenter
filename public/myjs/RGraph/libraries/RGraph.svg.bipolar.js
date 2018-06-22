// version: 2018-02-24
    /**
    * o--------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:               |
    * |                                                                                |
    * |                          http://www.rgraph.net                                 |
    * |                                                                                |
    * | RGraph is licensed under the Open Source MIT license. That means that it's     |
    * | totally free to use and there are no restrictions on what you can do with it!  |
    * o--------------------------------------------------------------------------------o
    */

    RGraph = window.RGraph || {isRGraph: true};
    RGraph.SVG = RGraph.SVG || {};

// Module pattern
(function (win, doc, undefined)
{
    var RG  = RGraph,
        ua  = navigator.userAgent,
        ma  = Math,
        win = window,
        doc = document;



    RG.SVG.Bipolar = function (conf)
    {
        //
        // A setter that the constructor uses (at the end)
        // to set all of the properties
        //
        // @param string name  The name of the property to set
        // @param string value The value to set the property to
        //
        this.set = function (name, value)
        {
            if (arguments.length === 1 && typeof name === 'object') {
                for (i in arguments[0]) {
                    if (typeof i === 'string') {
                    
                        var ret = RG.SVG.commonSetter({
                            object: this,
                            name:   i,
                            value:  arguments[0][i]
                        });
                        
                        name  = ret.name;
                        value = ret.value;

                        this.set(name, value);
                    }
                }
            } else {
                    
                var ret = RG.SVG.commonSetter({
                    object: this,
                    name:   name,
                    value:  value
                });
                
                name  = ret.name;
                value = ret.value;

                this.properties[name] = value;

                // If setting the colors, update the originalColors
                // property too
                if (name === 'colors') {
                    this.originalColors = RG.SVG.arrayClone(value);
                    this.colorsParsed = false;
                }
            }

            return this;
        };








        this.id                    = conf.id;
        this.uid                   = RG.SVG.createUID();
        this.container             = document.getElementById(this.id);
        this.layers                = {}; // MUST be before the SVG tag is created!
        this.svg                   = RG.SVG.createSVG({object: this,container: this.container});
        this.isRGraph              = true;
        this.data                  = [conf.left, conf.right];
        this.left                  = conf.left;
        this.right                 = conf.right;
        this.type                  = 'bipolar';
        this.coords                = [];
        this.coordsLeft            = [];
        this.coordsRight           = [];
        this.coords2               = [];
        this.coords2Left           = [];
        this.coords2Right          = [];
        this.stackedBackfacesLeft  = [];
        this.stackedBackfacesRight = [];
        this.originalColors        = {};
        this.gradientCounter       = 1;
        this.sequentialIndex       = 0; // Used for tooltips
        
        // Add this object to the ObjectRegistry
        RG.SVG.OR.add(this);
        
        this.container.style.display = 'inline-block';

        this.properties =
        {
            gutterLeft:   35,
            gutterRight:  35,
            gutterTop:    35,
            gutterBottom: 35,
            gutterCenter: null,

            backgroundColor:            null,
            backgroundGrid:             true,
            backgroundGridColor:        '#ddd',
            backgroundGridLinewidth:    1,
            backgroundGridHlines:       true,
            backgroundGridHlinesCount:  null,
            backgroundGridVlines:       true,
            backgroundGridVlinesCount:  null,
            backgroundGridBorder:       true,
            backgroundGridDashed:       false,
            backgroundGridDotted:       false,
            backgroundGridDashArray:    null,

            xaxis:                true,
            xaxisLinewidth:       1,
            xaxisTickmarks:       true,
            xaxisTickmarksLength: 5,
            xaxisLabelsCount:     5,
            xaxisLabelsPositionEdgeTickmarksCount: 5,
            xaxisColor:           'black',
            xaxisLabelsOffsetx:   0,
            xaxisLabelsOffsety:   0,
            
            xaxisUnitsPre:        '',
            xaxisUnitsPost:       '',
            xaxisStrict:          false,
            xaxisDecimals:        0,
            xaxisPoint:           '.',
            xaxisThousand:        ',',
            xaxisRound:           false,
            xaxisMax:             null,
            xaxisMin:             0,
            xaxisFormatter:       null,
            
            xaxisTextFont:        null,
            xaxisTextSize:        null,
            xaxisTextBold:        null,
            xaxisTextItalic:      null,
            xaxisTextColor:       null,


            yaxis:                true,
            yaxisTickmarks:       true,
            yaxisTickmarksLength: 5,
            yaxisColor:           'black',
            
            yaxisScale:           false,
            yaxisLabels:          null,
            yaxisLabelsOffsetx:   0,
            yaxisLabelsOffsety:   0,
            
            yaxisTextFont:        null,
            yaxisTextSize:        null,
            yaxisTextBold:        null,
            yaxisTextItalic:      null,
            yaxisTextColor:       null,
            
            // 20 colors. If you need more you need to set the colors property
            colors: [
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black',
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black'
            ],
            colorsSequential:     false,
            strokestyle:          'rgba(0,0,0,0)',
            
            vmargin:              3,
            vmarginGrouped:       2,

            labelsAbove:                  false,
            labelsAboveFont:              null,
            labelsAboveSize:              null,
            labelsAboveBold:              null,
            labelsAboveItalic:            null,
            labelsAboveColor:             null,
            labelsAboveBackground:        null,
            labelsAboveBackgroundPadding: 0,
            labelsAboveUnitsPre:          null,
            labelsAboveUnitsPost:         null,
            labelsAbovePoint:             null,
            labelsAboveThousand:          null,
            labelsAboveFormatter:         null,
            labelsAboveDecimals:          null,
            labelsAboveOffsetx:           0,
            labelsAboveOffsety:           0,
            labelsAboveSpecific:          null,
            
            textColor:            'black',
            textFont:             'sans-serif',
            textSize:             12,
            textBold:             false,
            textItalic:           false,

            linewidth:            1,
            grouping:             'grouped',
            
            tooltips:             null,
            tooltipsOverride:     null,
            tooltipsEffect:       'fade',
            tooltipsCssClass:     'RGraph_tooltip',
            tooltipsEvent:        'click',

            highlightStroke:      'rgba(0,0,0,0)',
            highlightFill:        'rgba(255,255,255,0.7)',
            highlightLinewidth:   1,
            
            title:                '',
            titleSize:            16,
            titleX:               null,
            titleY:               null,
            titleHalign:          'center',
            titleValign:          null,
            titleColor:           'black',
            titleFont:            null,
            titleBold:            false,
            titleItalic:          false,
            
            titleSubtitle:        null,
            titleSubtitleSize:    10,
            titleSubtitleX:       null,
            titleSubtitleY:       null,
            titleSubtitleHalign:  'center',
            titleSubtitleValign:  null,
            titleSubtitleColor:   '#aaa',
            titleSubtitleFont:    null,
            titleSubtitleBold:    false,
            titleSubtitleItalic:  false,
            
            shadow:               false,
            shadowOffsetx:        2,
            shadowOffsety:        2,
            shadowBlur:           2,
            shadowOpacity:        0.25,

            key:            null,
            keyColors:      null,
            keyOffsetx:     0,
            keyOffsety:     0,
            keyTextOffsetx: 0,
            keyTextOffsety: -1,
            keyTextSize:    null,
            keyTextBold:    null,
            keyTextItalic:  null,
            keyTextFont:    null
        };




        //
        // Copy the global object properties to this instance
        //
        RG.SVG.getGlobals(this);





        /**
        * "Decorate" the object with the generic effects if the effects library has been included
        */
        if (RG.SVG.FX && typeof RG.SVG.FX.decorate === 'function') {
            RG.SVG.FX.decorate(this);
        }




        var prop = this.properties;








        //
        // The draw method draws the Bar chart
        //
        this.draw = function ()
        {
            // Fire the beforedraw event
            RG.SVG.fireCustomEvent(this, 'onbeforedraw');






            // Should the first thing that's done inthe.draw() function
            // except for the onbeforedraw event
            this.width  = Number(this.svg.getAttribute('width'));
            this.height = Number(this.svg.getAttribute('height'));










            // Create the defs tag if necessary
            RG.SVG.createDefs(this);

            




            //
            // Autosize the center gutter to allow for big labels
            //
            if (typeof prop.gutterCenter !== 'number') {
                prop.gutterCenter = this.getGutterCenter();
            }


            // Reset the coords arrays
            this.coords       = [];
            this.coordsLeft   = [];
            this.coordsRight  = [];
            this.coords2      = [];
            this.coords2Left  = [];
            this.coords2Right = [];


            this.graphWidth  = (this.width - prop.gutterLeft - prop.gutterRight - prop.gutterCenter) / 2;
            this.graphHeight = this.height - prop.gutterTop - prop.gutterBottom;



            /**
            * Parse the colors. This allows for simple gradient syntax
            */

            // Parse the colors for gradients
            RG.SVG.resetColorsToOriginalValues({object:this});
            this.parseColors();



            // Go through the data and work out the maximum value
            var values = [];

            for (var i=0; i<2; ++i) {
                for (var j=0,max=0; j<this.data[i].length; ++j) {
                    if (typeof this.data[i][j] === 'number') {
                        values.push(this.data[i][j]);
                    
                    } else if (RG.SVG.isArray(this.data[i][j]) && prop.grouping === 'grouped') {
                        values.push(RG.SVG.arrayMax(this.data[i][j]));
    
                    } else if (RG.SVG.isArray(this.data[i][j]) && prop.grouping === 'stacked') {
                        values.push(RG.SVG.arraySum(this.data[i][j]));
                    }
                }
            }
            
            var max = RG.SVG.arrayMax(values);

            // A custom, user-specified maximum value
            if (typeof prop.xaxisMax === 'number') {
                max = prop.xaxisMax;
            }



            //
            // Generate an appropiate scale
            //
            this.scale = RG.SVG.getScale({
                object:    this,
                numlabels: prop.xaxisLabelsCount,
                unitsPre:  prop.xaxisUnitsPre,
                unitsPost: prop.xaxisUnitsPost,
                max:       max,
                min:       prop.xaxisMin,
                point:     prop.xaxisPoint,
                round:     prop.xaxisRound,
                thousand:  prop.xaxisThousand,
                decimals:  prop.xaxisDecimals,
                strict:    typeof prop.xaxisMax === 'number',
                formatter: prop.xaxisFormatter
            });





            // Now the scale has been generated adopt its max value
            this.max      = this.scale.max;
            this.min      = this.scale.min;
            prop.yaxisMax = this.scale.max;
            prop.yaxisMin = this.scale.min;



            // Draw the background first
            this.drawBackground(this);
            
            // Draw the title
            this.drawTitle();



            // Draw the bars
            this.drawBars();


            // Draw the axes over the bars
            this.drawAxes();


            // Draw the labels for both of the the axes
            this.drawLabels()
            
            
            // Draw the labelsAbove labels
            this.drawLabelsAbove();



            
            
            // Draw the key
            if (typeof prop.key !== null && RG.SVG.drawKey) {
                RG.SVG.drawKey(this);
            } else if (!RG.SVG.isNull(prop.key)) {
                alert('The drawKey() function does not exist - have you forgotten to include the key library?');
            }



            // Fire the draw event
            RG.SVG.fireCustomEvent(this, 'ondraw');

            return this;
        };








        //
        // Draws the background
        //
        this.drawBackground = function ()
        {
            // Save the original gutter properties
            var originalGutterRight = prop.gutterRight,
                originalGutterLeft  = prop.gutterLeft;
            
            // Draw the LEFT background
            prop.gutterRight = this.width - (prop.gutterLeft + this.graphWidth);
            if (RG.SVG.isNull(prop.backgroundGridHlinesCount)) {
                var resetToNull = true;
                prop.backgroundGridHlinesCount = this.left.length;
            }





            // Set the LEFT background image properties
            var properties = ['','Aspect','Opacity','Stretch','X','Y','W','H',];
            
            for (i in properties ) {
                if (typeof properties[i] === 'string') {
                    prop['backgroundImage' + properties[i]] = prop['backgroundImageLeft' + properties[i]];
                }
            }




            RG.SVG.drawBackground(this);
            
            if (resetToNull) {
                prop.backgroundGridHlinesCount = null;
            }
















            // Draw the RIGHT background
            prop.gutterRight = originalGutterRight;
            prop.gutterLeft  = this.width - (prop.gutterRight + this.graphWidth);
            if (RG.SVG.isNull(prop.backgroundGridHlinesCount)) {
                prop.backgroundGridHlinesCount = this.right.length;
            }














            // Set the RIGHT background image properties
            var properties = ['','Aspect','Opacity','Stretch','X','Y','W','H',];
            
            for (i in properties ) {
                if (typeof properties[i] === 'string') {
                    prop['backgroundImage' + properties[i]] = prop['backgroundImageRight' + properties[i]];
                }
            }





            // Draw the background
            RG.SVG.drawBackground(this);






            // Reset the gutter properties to the original values
            prop.gutterLeft  = originalGutterLeft;
            prop.gutterRight = originalGutterRight;
        };



























        //
        // Draws the axes
        //
        this.drawAxes = function ()
        {
            // Draw the LEFT X axes
            if (prop.xaxis) {
                RG.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            prop.gutterLeft,
                            this.height - prop.gutterBottom,
                            prop.gutterLeft + this.graphWidth,
                            this.height - prop.gutterBottom
                        ),
                        'stroke-width': prop.xaxisLinewidth,
                        stroke: prop.xaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges'
                    }
                });




                // Draw the right X axis
                RG.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            this.width - prop.gutterRight,
                            this.height - prop.gutterBottom,
                            this.width - prop.gutterRight - this.graphWidth,
                            this.height - prop.gutterBottom
                        ),
                        'stroke-width': prop.xaxisLinewidth,
                        stroke: prop.xaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges'
                    }
                });
                
                //
                // Draw tickmarks if necessary
                //
                if (prop.xaxisTickmarks) {
                
                    var startY = this.height - prop.gutterBottom,
                        endY   = this.height - prop.gutterBottom + prop.xaxisTickmarksLength;

                    // Draw the LEFT sides tickmarks
                    for (var i=0; i<prop.xaxisLabelsPositionEdgeTickmarksCount; ++i) {
    
                        var x = prop.gutterLeft + (i * (this.graphWidth / prop.xaxisLabelsPositionEdgeTickmarksCount));

                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                    
                    // Draw an extra LEFT tick if no Y axis is being shown
                    if (!prop.yaxis) {
                        
                        var x = prop.gutterLeft + this.graphWidth;

                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }









                    // Draw the RIGHT sides tickmarks
                    for (var i=0; i<prop.xaxisLabelsPositionEdgeTickmarksCount; ++i) {
    
                        var x = prop.gutterLeft + prop.gutterCenter + this.graphWidth + ((i+1) * (this.graphWidth / prop.xaxisLabelsPositionEdgeTickmarksCount));

                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }


                    // Draw an extra RIGHT tick if no Y axis is being shown
                    if (!prop.yaxis) {
                        
                        var x = prop.gutterLeft + this.graphWidth + prop.gutterCenter;

                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x + 0.001,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: prop.xaxisColor,
                                'stroke-width': prop.xaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                }
            }














            // Draw the LEFT vertical axes
            if (prop.yaxis) {
                RG.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            prop.gutterLeft + this.graphWidth,
                            this.height - prop.gutterBottom,
                            prop.gutterLeft + this.graphWidth,
                            prop.gutterTop
                        ),
                        'stroke-width': prop.yaxisLinewidth,
                        stroke: prop.yaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges',
                        'stroke-linecap': 'square'
                    }
                });




                // Draw the RIGHT vertical  axis
                RG.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svg.all,
                    attr: {
                        d: 'M {1} {2} L {3} {4}'.format(
                            prop.gutterLeft + this.graphWidth + prop.gutterCenter,
                            this.height - prop.gutterBottom,
                            prop.gutterLeft + this.graphWidth + prop.gutterCenter,
                            prop.gutterTop
                        ),
                        'stroke-width': prop.yaxisLinewidth,
                        stroke: prop.yaxisColor,
                        fill: 'rgba(0,0,0,0)',
                        'shape-rendering': 'crispEdges',
                        'stroke-linecap': 'square'
                    }
                });




                //
                // Draw Y axis tickmarks if necessary
                //
                if (prop.yaxisTickmarks) {
                
                    var startX   = prop.gutterLeft + this.graphWidth,
                        endX     = prop.gutterLeft + this.graphWidth + prop.yaxisTickmarksLength,
                        numticks = this.left.length;
    
                    // Draw the left sides tickmarks
                    for (var i=0; i<numticks; ++i) {
    
                        var y = prop.gutterTop + (i * (this.graphHeight / numticks));
    
                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                    
                    // Draw an extra LEFT tickmark if the X axis is not being shown
                    if (!prop.xaxis) {

                        var y = prop.gutterTop + this.graphHeight;
    
                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }












                    var startX   = prop.gutterLeft + this.graphWidth + prop.gutterCenter,
                        endX     = prop.gutterLeft + this.graphWidth + prop.gutterCenter - prop.yaxisTickmarksLength,
                        numticks = this.right.length;



                    for (var i=0; i<numticks; ++i) {
    
                        var y = prop.gutterTop + (i * (this.graphHeight / numticks));
    
                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                    
                    // Draw an extra RIGHT tickmark if the X axis is not being shown
                    if (!prop.xaxis) {

                        var y = prop.gutterTop + this.graphHeight;
    
                        RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX + 0.001,
                                    y,
                                    endX,
                                    y
                                ),
                                stroke: prop.yaxisColor,
                                'stroke-width': prop.yaxisLinewidth,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                }
            }
        };








        //
        // Draws the labels
        //
        this.drawLabels = function ()
        {
            //
            // Draw the Y axis labels
            //
            var numlabels = prop.yaxisLabels ? prop.yaxisLabels.length : 5

            for (var i=0; i<numlabels; ++i) {

                var segment = this.graphHeight / numlabels,
                    y       = prop.gutterTop + (segment * i) + (segment / 2) + prop.yaxisLabelsOffsety,
                    x       = prop.gutterLeft + this.graphWidth + (prop.gutterCenter / 2) + prop.yaxisLabelsOffsetx;

                var text = RG.SVG.text({
                    object: this,
                    parent: this.svg.all,
                    text:   prop.yaxisLabels && prop.yaxisLabels[i] ? prop.yaxisLabels[i] : '',
                    x:      x,
                    y:      y,
                    halign: 'center',
                    valign: 'center',
                    tag:    'labels.yaxis',
                    font:   prop.yaxisTextFont   || prop.textFont,
                    size:   prop.yaxisTextSize   || (typeof prop.textSize === 'number' ? prop.textSize + 'pt' : prop.textSize),
                    bold:   !RG.SVG.isNull(prop.yaxisTextBold) ? prop.yaxisTextBold : prop.textBold,
                    italic: !RG.SVG.isNull(prop.yaxisTextItalic) ? prop.yaxisTextItalic : prop.textItalic,
                    color:  prop.yaxisTextColor  || prop.textColor
                });
            }




            //
            // Draw the X axis scale for the LEFT side
            //
            var segment = this.graphWidth / prop.xaxisLabelsCount;

            for (var i=0; i<this.scale.labels.length; ++i) {

                RG.SVG.text({
                    object: this,
                    parent: this.svg.all,
                    text:   this.scale.labels[i],
                    x:      prop.gutterLeft + this.graphWidth - (segment * (i+1)) + prop.xaxisLabelsOffsetx,
                    y:      this.height - prop.gutterBottom + 10 + prop.xaxisLabelsOffsety,
                    halign: 'center',
                    valign: 'top',
                    tag:    'labels.xaxis',
                    font:   prop.xaxisTextFont   || prop.textFont,
                    size:   prop.xaxisTextSize   || (typeof prop.textSize === 'number' ? prop.textSize + 'pt' : prop.textSize),
                    bold:   typeof prop.xaxisTextBold   === 'boolean' ? prop.xaxisTextBold   : prop.textBold,
                    italic: typeof prop.xaxisTextItalic === 'boolean' ? prop.xaxisTextItalic : prop.textItalic,
                    color:  prop.xaxisTextColor  || prop.textColor
                });
            }




            //
            // Add the minimum label for the LEST side
            //
            var y   = this.height - prop.gutterBottom + 10,
                str = (prop.xaxisUnitsPre + prop.xaxisMin.toFixed(prop.xaxisDecimals).replace(/\./, prop.xaxisPoint) + prop.xaxisUnitsPost);

            var text = RG.SVG.text({
                object:     this,
                parent:     this.svg.all,
                text:       str,
                x:          prop.gutterLeft + this.graphWidth + prop.xaxisLabelsOffsetx,
                y:          y + prop.xaxisLabelsOffsety,
                halign: 'center',
                valign: 'top',
                tag:    'labels.xaxis',
                font:   prop.xaxisTextFont   || prop.textFont,
                size:   prop.xaxisTextSize   || (typeof prop.textSize === 'number' ? prop.textSize + 'pt' : prop.textSize),
                bold:   typeof prop.xaxisTextBold   === 'boolean' ? prop.xaxisTextBold   : prop.textBold,
                italic: typeof prop.xaxisTextItalic === 'boolean' ? prop.xaxisTextItalic : prop.textItalic,
                color:  prop.xaxisTextColor  || prop.textColor
            });
















            //
            // Draw the X axis scale for the RIGHT side
            //
            for (var i=0; i<this.scale.labels.length; ++i) {

                RG.SVG.text({
                    object: this,
                    parent: this.svg.all,
                    text:   this.scale.labels[i],
                    x:      prop.gutterLeft + this.graphWidth + prop.gutterCenter + (segment * (i + 1)) + prop.xaxisLabelsOffsetx,
                    y:      this.height - prop.gutterBottom + 10 + prop.xaxisLabelsOffsety,
                    halign: 'center',
                    valign: 'top',
                    tag:    'labels.xaxis',
                    font:   prop.xaxisTextFont   || prop.textFont,
                    size:   prop.xaxisTextSize   || (typeof prop.textSize === 'number' ? prop.textSize + 'pt' : prop.textSize),
                    bold:   typeof prop.xaxisTextBold   === 'boolean' ? prop.xaxisTextBold   : prop.textBold,
                    italic: typeof prop.xaxisTextItalic === 'boolean' ? prop.xaxisTextItalic : prop.textItalic,
                    color:  prop.xaxisTextColor  || prop.textColor
                });
            }




            //
            // Add the minimum label for the RIGHT side
            //
            var text = RG.SVG.text({
                object: this,
                parent: this.svg.all,
                text:   prop.xaxisUnitsPre + prop.xaxisMin.toFixed(prop.xaxisDecimals).replace(/\./, prop.xaxisPoint) + prop.xaxisUnitsPost,
                x:      prop.gutterLeft + this.graphWidth + prop.gutterCenter + prop.xaxisLabelsOffsetx,
                y:      this.height - prop.gutterBottom + 10 + prop.xaxisLabelsOffsety,
                halign: 'center',
                valign: 'top',
                tag:    'labels.xaxis',
                font:   prop.xaxisTextFont   || prop.textFont,
                size:   prop.xaxisTextSize   || (typeof prop.textSize === 'number' ? prop.textSize + 'pt' : prop.textSize),
                bold:   typeof prop.xaxisTextBold   === 'boolean' ? prop.xaxisTextBold   : prop.textBold,
                italic: typeof prop.xaxisTextItalic === 'boolean' ? prop.xaxisTextItalic : prop.textItalic,
                color:  prop.xaxisTextColor  || prop.textColor
            });

        };








        //
        // Draws the bars
        //
        this.drawBars = function ()
        {
            if (prop.shadow) {
                RG.SVG.setShadow({
                    object:  this,
                    offsetx: prop.shadowOffsetx,
                    offsety: prop.shadowOffsety,
                    blur:    prop.shadowBlur,
                    opacity: prop.shadowOpacity,
                    id:      'dropShadow'
                });
            }







            // Go thru the LEFT data and draw the bars
            for (var i=0; i<this.left.length; ++i) {






                // LEFT REGULAR NUMBER
                if (typeof this.left[i] === 'number') {

                    var color   = prop.colors[this.sequentialIndex],
                        tooltip = RG.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                        y       = prop.gutterTop + ((this.graphHeight / this.left.length) * i) + prop.vmargin,
                        width   = this.getWidth(this.left[i]),
                        x       = prop.gutterLeft + this.graphWidth - width,
                        height  = (this.graphHeight / this.left.length) - prop.vmargin - prop.vmargin;
                        
        
                    var rect = RG.SVG.create({
                        svg: this.svg,
                        parent: this.svg.all,
                        type: 'rect',
                        attr: {
                            x:                       x,
                            y:                       y,
                            width:                   width,
                            height:                  height,
                            fill:                    prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[0],
                            stroke:                  prop.strokestyle,
                            'stroke-width':          prop.linewidth,
                            'shape-rendering':       'crispEdges',
                            'data-original-x':       x,
                            'data-original-y':       y,
                            'data-original-width':   width,
                            'data-original-height':  height,
                            'data-tooltop':          (tooltip || ''),
                            'data-index':            i,
                            'data-sequential-index': this.sequentialIndex,
                            'data-value':            this.left[i],
                            filter: prop.shadow ? 'url(#dropShadow)' : ''
                        }
                    });











                    this.coords.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });

                    this.coordsLeft.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });




                    this.installTooltipsEventListeners({
                        rect: rect,
                        index: i,
                        sequentialIndex: this.sequentialIndex
                    });

                    this.sequentialIndex++;







                // LEFT STACKED
                } else if (RG.SVG.isArray(this.left[i]) && prop.grouping === 'stacked') {

                    var accWidth = 0;

                    for (var j=0; j<this.left[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RG.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            y        = prop.gutterTop + ((this.graphHeight / this.left.length) * i) + prop.vmargin,
                            width    = this.getWidth(this.left[i][j]),
                            accWidth = accWidth + width,
                            x        = prop.gutterLeft + this.graphWidth - accWidth,
                            height   = (this.graphHeight / this.left.length) - prop.vmargin - prop.vmargin;











                        // If this is the first iteration of the loop and a shadow
                        // is requested draw a rect here to create it.
                        if (j === 0 && prop.shadow) {
                            
                            var shadowBackfaceX = prop.gutterLeft + this.graphWidth - this.getWidth(RG.SVG.arraySum(this.left[i])),
                                shadowBackfaceWidth = this.getWidth(RG.SVG.arraySum(this.left[i]));
                                

                            var rect = RG.SVG.create({
                                svg: this.svg,
                                parent: this.svg.all,
                                type: 'rect',
                                attr: {
                                    fill: '#eee',
                                    x: shadowBackfaceX,
                                    y: y,
                                    width: shadowBackfaceWidth,
                                    height: height,
                                    'stroke-width': 0,
                                    'data-index': i,
                                    filter: 'url(#dropShadow)'
                                }
                            });

                            this.stackedBackfacesLeft[i] = rect;
                        }






                        var rect = RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                      x,
                                y:                      y,
                                width:                  width,
                                height:                 height,
                                fill:                   prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                 prop.strokestyle,
                                'stroke-width':         prop.linewidth,
                                'shape-rendering':      'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.left[i][j]
                            }
                        });






                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsLeft.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }

                        if (!this.coords2Left[i]) {
                            this.coords2Left[i] = [];
                        }

                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Left[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });










                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });
                        
                        
                        this.sequentialIndex++;
                    }









                // LEFT GROUPED
                } else if (RG.SVG.isArray(this.left[i]) && prop.grouping === 'grouped') {

                    for (var j=0; j<this.left[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RG.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            height   = ((this.graphHeight / this.left.length) - prop.vmargin - prop.vmargin - (prop.vmarginGrouped * (this.left[i].length - 1))) / this.left[i].length,
                            y        = prop.gutterTop + ((this.graphHeight / this.left.length) * i) + prop.vmargin + (height * j) + (j * prop.vmarginGrouped),
                            width    = this.getWidth(this.left[i][j]),
                            x        = prop.gutterLeft + this.graphWidth - width;

            
                        var rect = RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                      x,
                                y:                      y,
                                width:                  width,
                                height:                 height,
                                fill:                   prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                 prop.strokestyle,
                                'stroke-width':         prop.linewidth,
                                'shape-rendering':      'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.left[i][j],
                                filter: prop.shadow ? 'url(#dropShadow)' : ''
                            }
                        });






                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsLeft.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });


                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }

                        if (!this.coords2Left[i]) {
                            this.coords2Left[i] = [];
                        }

                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Left[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });

                        this.sequentialIndex++;
                    }
                }
            }


















            // Go thru the RIGHT data and draw the bars
            for (var i=0; i<this.right.length; ++i) {
            
            
            
            
            
            
            
            
                // RIGHT REGULAR
                if (typeof this.right[i] === 'number') {

                    var color   = prop.colors[this.sequentialIndex],
                        tooltip = RG.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                        y       = prop.gutterTop + ((this.graphHeight / this.right.length) * i) + prop.vmargin,
                        width   = this.getWidth(this.right[i]),
                        x       = prop.gutterLeft + this.graphWidth + prop.gutterCenter,
                        height  = (this.graphHeight / this.right.length) - prop.vmargin - prop.vmargin;
                        
        
                    var rect = RG.SVG.create({
                        svg: this.svg,
                        parent: this.svg.all,
                        type: 'rect',
                        attr: {
                            x:                       x,
                            y:                       y,
                            width:                   width,
                            height:                  height,
                            fill:                    prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[0],
                            stroke:                  prop.strokestyle,
                            'stroke-width':          prop.linewidth,
                            'shape-rendering':       'crispEdges',
                            'data-original-x':       x,
                            'data-original-y':       y,
                            'data-original-width':   width,
                            'data-original-height':  height,
                            'data-tooltop':          (tooltip || ''),
                            'data-index':            i,
                            'data-sequential-index': this.sequentialIndex,
                            'data-value':            this.right[i],
                            filter: prop.shadow ? 'url(#dropShadow)' : ''
                        }
                    });


                    this.coords.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });

                    this.coordsRight.push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });

                    this.installTooltipsEventListeners({
                        rect: rect,
                        index: i,
                        sequentialIndex: this.sequentialIndex
                    });
                    
                    this.sequentialIndex++;


                // RIGHT STACKED
                } else if (RG.SVG.isArray(this.right[i]) && prop.grouping === 'stacked') {


                    var accWidth = 0;

                    for (var j=0; j<this.right[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RG.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            y        = prop.gutterTop + ((this.graphHeight / this.right.length) * i) + prop.vmargin,
                            width    = this.getWidth(this.right[i][j]),
                            x        = prop.gutterLeft + this.graphWidth + prop.gutterCenter + accWidth,
                            accWidth = accWidth + width,
                            height   = (this.graphHeight / this.left.length) - prop.vmargin - prop.vmargin;








                        // If this is the first iteration of the loop and a shadow
                        // is requested draw a rect here to create it.
                        if (j === 0 && prop.shadow) {
                            
                            var shadowBackfaceX     = prop.gutterLeft + this.graphWidth + prop.gutterCenter,
                                shadowBackfaceWidth = this.getWidth(RG.SVG.arraySum(this.right[i]));
                                

                            var rect = RG.SVG.create({
                                svg: this.svg,
                                parent: this.svg.all,
                                type: 'rect',
                                attr: {
                                    fill: '#eee',
                                    x: shadowBackfaceX,
                                    y: y,
                                    width: shadowBackfaceWidth,
                                    height: height,
                                    'stroke-width': 0,
                                    'data-index': i,
                                    filter: 'url(#dropShadow)'
                                }
                            });
                            
                            this.stackedBackfacesRight[i] = rect;
                        }
















                        var rect = RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                       x,
                                y:                       y,
                                width:                   width,
                                height:                  height,
                                fill:                    prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                  prop.strokestyle,
                                'stroke-width':          prop.linewidth,
                                'shape-rendering':       'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.right[i][j]
                            }
                        });









                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsRight.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });



                        if (!this.coords2[i + this.left.length]) {
                            this.coords2[i + this.left.length] = [];
                        }

                        if (!this.coords2Right[i]) {
                            this.coords2Right[i] = [];
                        }

                        this.coords2[i + this.left.length].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Right[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });

                        this.sequentialIndex++;
                    }













                // RIGHT GROUPED
                } else if (RG.SVG.isArray(this.right[i]) && prop.grouping === 'grouped') {

                    for (var j=0; j<this.right[i].length; ++j) {

                        var color    = prop.colors[this.sequentialIndex],
                            tooltip  = RG.SVG.isNull(prop.tooltips) ? null : prop.tooltips[this.sequentialIndex],
                            height   = ((this.graphHeight / this.right.length) - prop.vmargin - prop.vmargin - (prop.vmarginGrouped * (this.right[i].length - 1))) / this.right[i].length,
                            y        = prop.gutterTop + ((this.graphHeight / this.right.length) * i) + prop.vmargin + (height * j) + (j * prop.vmarginGrouped),
                            width    = this.getWidth(this.right[i][j]),
                            x        = prop.gutterLeft + this.graphWidth + prop.gutterCenter;

            
                        var rect = RG.SVG.create({
                            svg: this.svg,
                            parent: this.svg.all,
                            type: 'rect',
                            attr: {
                                x:                      x,
                                y:                      y,
                                width:                  width,
                                height:                 height,
                                fill:                   prop.colorsSequential ? prop.colors[this.sequentialIndex] : prop.colors[j],
                                stroke:                 prop.strokestyle,
                                'stroke-width':         prop.linewidth,
                                'shape-rendering':      'crispEdges',
                                'data-original-x':       x,
                                'data-original-y':       y,
                                'data-original-width':   width,
                                'data-original-height':  height,
                                'data-tooltop':          (tooltip || ''),
                                'data-index':            i,
                                'data-subindex':         j,
                                'data-sequential-index': this.sequentialIndex,
                                'data-value':            this.right[i][j],
                                filter: prop.shadow ? 'url(#dropShadow)' : ''
                            }
                        });









                        this.coords.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coordsRight.push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });









                        if (!this.coords2[i + this.left.length]) {
                            this.coords2[i + this.left.length] = [];
                        }

                        if (!this.coords2Right[i]) {
                            this.coords2Right[i] = [];
                        }

                        this.coords2[i + this.left.length].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });

                        this.coords2Right[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });










                        this.installTooltipsEventListeners({
                            rect: rect,
                            index: i,
                            sequentialIndex: this.sequentialIndex
                        });

                        this.sequentialIndex++;
                    }
                }
            }
        };








        //
        // Installs the tooltips event lissteners. This is called from the
        // above function.
        //
        // @param object opt The various arguments to the function
        //
        this.installTooltipsEventListeners = function (opt)
        {
            var obj = this;

            // Add the tooltip events
            if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[this.sequentialIndex]) {
                //
                // Add tooltip event listeners
                //
                (function (idx, seq)
                {

                    opt.rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                    {
                        obj.removeHighlight();

                        // Show the tooltip
                        RG.SVG.tooltip({
                            object:          obj,
                            index:           idx,
                            group:           null,
                            sequentialIndex: seq,
                            text:            prop.tooltips[seq],
                            event:           e
                        });
                        
                        // Highlight the rect that has been clicked on
                        obj.highlight(e.target);
                    }, false);

                    opt.rect.addEventListener('mousemove', function (e)
                    {
                        e.target.style.cursor = 'pointer'
                    }, false);
                })(opt.index, opt.sequentialIndex);
            }
        };








        /**
        * 
        * 
        * @param int value The value to get the width for.
        */
        this.getWidth = function (value)
        {
            var x1 = this.getLeftXCoord(0),
                x2 = this.getLeftXCoord(value);

            if (RG.SVG.isNull(x1) || RG.SVG.isNull(x2)) {
                return null;
            }

            return x1 - x2;
        };








        /**
        * This function is similar to the above but instead 
        * of a width it gets a relevant coord for a value
        * on the LEFT side
        * 
        * @param int value The value to get the coordinate for.
        */
        this.getLeftXCoord = function (value)
        {
            var width;

            if (value > this.scale.max) {
                return null;
            }

            if (value < this.scale.min) {
                return null;
            }

            width  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            width *= this.graphWidth;
            
            // Calculate the X coord
            var x  = prop.gutterLeft + this.graphWidth - width;

            return x;
        };








        /**
        * This function gets an X coordinate for the RIGHT
        * side.
        * 
        * @param int value The value to get the coordinate for.
        */
        this.getRightXCoord = function (value)
        {
            var width;

            if (value > this.scale.max) {
                return null;
            }

            if (value < this.scale.min) {
                return null;
            }

            width  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            width *= this.graphWidth;
            
            // Calculate the X coord
            var x  = prop.gutterLeft + this.graphWidth + prop.gutterCenter + width;

            return x;
        };








        /**
        * This function can be used to highlight a bar on the chart
        * 
        * @param object rect The rectangle to highlight
        */
        this.highlight = function (rect)
        {
            var x      = parseInt(rect.getAttribute('x')),
                y      = parseInt(rect.getAttribute('y')),
                width  = parseInt(rect.getAttribute('width')),
                height = parseInt(rect.getAttribute('height'));
            
            var highlight = RG.SVG.create({
                svg: this.svg,
                parent: this.svg.all,
                type: 'rect',
                attr: {
                    stroke:         prop.highlightStroke,
                    fill:           prop.highlightFill,
                    x:              x - 1,
                    y:              y - 1,
                    width:          width + 2,
                    height:         height + 2
                },
                style: {
                    pointerEvents: 'none'
                }
            });


            // Store the highlight rect in the rebistry so
            // it can be cleared later
            RG.SVG.REG.set('highlight', highlight);
        };








        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function () 
        {
            // Save the original colors so that they can be restored when
            // the canvas is cleared
            if (!Object.keys(this.originalColors).length) {
                this.originalColors = {
                    colors:              RG.SVG.arrayClone(prop.colors),
                    backgroundGridColor: RG.SVG.arrayClone(prop.backgroundGridColor),
                    highlightFill:       RG.SVG.arrayClone(prop.highlightFill),
                    backgroundColor:     RG.SVG.arrayClone(prop.backgroundColor)
                }
            }


            // colors
            var colors = prop.colors;

            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = RG.SVG.parseColorLinear({
                        object: this,
                        color: colors[i],
                        direction: 'horizontal'
                    });
                }
            }

            prop.backgroundGridColor = RG.SVG.parseColorLinear({object: this, color: prop.backgroundGridColor,direction:'horizontal'});
            prop.highlightFill       = RG.SVG.parseColorLinear({object: this, color: prop.highlightFill,direction:'horizontal'});
            prop.backgroundColor     = RG.SVG.parseColorLinear({object: this, color: prop.backgroundColor,direction:'horizontal'});
        };








        //
        // Draws the labelsAbove
        //
        this.drawLabelsAbove = function ()
        {
            // Go through the above labels
            if (prop.labelsAbove) {

                //var data_seq      = RG.SVG.arrayLinearize(this.data),
                //    seq           = 0,
                //    stacked_total = 0;

                for (var dataset=0,seq=0; dataset<this.data.length; ++dataset,++seq) {
                    for (var i=0; i<this.data[dataset].length; ++i,++seq) {
                    
                        var value   = this.data[dataset][i],
                            halign  = dataset === 0 ? 'right' : 'left',
                            valign  = 'center',
                            hoffset = dataset === 0 ? -10 : 10;














                        // REGULAR CHART
                        if (typeof value === 'number') {

                            var x      = parseInt(this.coords[seq].element.getAttribute('x')) + hoffset + prop.labelsAboveOffsetx,
                                height = parseInt(this.coords[seq].element.getAttribute('height')),
                                y      = parseInt(this.coords[seq].element.getAttribute('y')) + (height / 2) + prop.labelsAboveOffsety,
                                width  = parseInt(this.coords[seq].element.getAttribute('width'));
                            
                            // If the dataset is the RHS (which would equal )
                            // then set the alignment appropriately
                            if (dataset === 1) {
                                x += width;
                            }

                            var str = RG.SVG.numberFormat({
                                object:    this,
                                num:       value.toFixed(prop.labelsAboveDecimals),
                                prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                                append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                                point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                                thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                                formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                            });


                            // Facilitate labelsAboveSpecific
                            if (prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && (typeof prop.labelsAboveSpecific[seq] === 'string' || typeof prop.labelsAboveSpecific[seq] === 'number') ) {
                                str = parseStr(prop.labelsAboveSpecific[seq]);
                            } else if ( prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && typeof prop.labelsAboveSpecific[seq] !== 'string' && typeof prop.labelsAboveSpecific[seq] !== 'number') {
                                continue;
                            }
    
                            // Add the text to the SVG
                            RG.SVG.text({
                                object:     this,
                                parent:     this.svg.all,
                                text:       str,
                                x:          x,
                                y:          y,
                                halign:     halign,
                                valign:     valign,
                                tag:        'labels.above',
                                font:       prop.labelsAboveFont              || prop.textFont,
                                size:       prop.labelsAboveSize              || prop.textSize,
                                bold:       typeof prop.labelsAboveBold   === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                                italic:     typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                                color:      prop.labelsAboveColor             || prop.textColor,
                                background: prop.labelsAboveBackground,
                                padding:    prop.labelsAboveBackgroundPadding
                            });














                        // STACKED CHART
                        } else if (typeof value === 'object' && prop.grouping === 'stacked') {
                            
                            for (var k=0,sum=0,width=0; k<this.coords2[i].length; ++k) {
                                sum   += parseFloat(this.coords2[i][k].element.getAttribute('data-value'));
                            }
                            
                            var len =this.coords2[i].length;

                            if (dataset === 0) {
                                var x      = parseFloat(this.coords2[i][len - 1].x) + hoffset,
                                    height = parseFloat(this.coords2[i][len - 1].height),
                                    y      = parseFloat(this.coords2[i][0].y) + (height / 2);
                            } else {
                                var x      = parseFloat(this.coords2[this.data[0].length + i][0].x) + hoffset + prop.labelsAboveOffsetx,
                                    height = parseFloat(this.coords2[i][len - 1].height),
                                    y      = parseFloat(this.coords2[i][0].y) + (height / 2) + prop.labelsAboveOffsety;

                                // Work out the total width by summing all the individual widths

                                for (var j=0; j<this.coords2Right[i].length; ++j) {
                                    x += this.coords2Right[i][j].width;
                                }
                            }

                            var str = RG.SVG.numberFormat({
                                object:    this,
                                num:       sum.toFixed(prop.labelsAboveDecimals),
                                prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                                append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                                point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                                thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                                formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                            });

                            // Facilitate labelsAboveSpecific
                            if (prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && (typeof prop.labelsAboveSpecific[seq] === 'string' || typeof prop.labelsAboveSpecific[seq] === 'number') ) {
                                str = parseStr(prop.labelsAboveSpecific[seq]);
                            } else if ( prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && typeof prop.labelsAboveSpecific[seq] !== 'string' && typeof prop.labelsAboveSpecific[seq] !== 'number') {
                                continue;
                            }
    
                            // Add the text to the SVG
                            RG.SVG.text({
                                object:     this,
                                parent:     this.svg.all,
                                text:       str,
                                x:          x,
                                y:          y,
                                halign:     halign,
                                valign:     valign,
                                tag:        'labels.above',
                                font:       prop.labelsAboveFont              || prop.textFont,
                                size:       prop.labelsAboveSize              || prop.textSize,
                                bold:       typeof prop.labelsAboveBold   === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                                italic:     typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                                color:      prop.labelsAboveColor             || prop.textColor,
                                background: prop.labelsAboveBackground,
                                padding:    prop.labelsAboveBackgroundPadding
                            });


















                        // GROUPED CHART
                        } else if (typeof value === 'object' && prop.grouping === 'grouped') {

                            for (var k=0; k<value.length; ++k) {
                            
                                val = value[k];


                                var x      = parseInt(this.coords[seq].element.getAttribute('x')) + hoffset + prop.labelsAboveOffsetx,
                                    height = parseInt(this.coords[seq].element.getAttribute('height')),
                                    y      = parseInt(this.coords[seq].element.getAttribute('y')) + (height / 2) + prop.labelsAboveOffsety,
                                    width  = parseInt(this.coords[seq].element.getAttribute('width'));
                                
                                // If the dataset is the RHS (which would equal )
                                // then set the alignment appropriately
                                if (dataset === 1) {
                                    x += width;
                                }
    
                                var str = RG.SVG.numberFormat({
                                    object:    this,
                                    num:       parseFloat(val).toFixed(prop.labelsAboveDecimals),
                                    prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                                    append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                                    point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                                    thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                                    formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                                });

                                // Facilitate labelsAboveSpecific
                                if (prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && (typeof prop.labelsAboveSpecific[seq] === 'string' || typeof prop.labelsAboveSpecific[seq] === 'number') ) {
                                    str = parseStr(prop.labelsAboveSpecific[seq]);
                                } else if ( prop.labelsAboveSpecific && prop.labelsAboveSpecific.length && typeof prop.labelsAboveSpecific[seq] !== 'string' && typeof prop.labelsAboveSpecific[seq] !== 'number') {
                                    continue;
                                }

                                // Add the text to the SVG
                                RG.SVG.text({
                                    object:     this,
                                    parent:     this.svg.all,
                                    text:       str,
                                    x:          x,
                                    y:          y,
                                    halign:     halign,
                                    valign:     valign,
                                    tag:        'labels.above',
                                    font:       prop.labelsAboveFont              || prop.textFont,
                                    size:       prop.labelsAboveSize              || prop.textSize,
                                    bold:       typeof prop.labelsAboveBold   === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                                    italic:     typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                                    color:      prop.labelsAboveColor             || prop.textColor,
                                    background: prop.labelsAboveBackground,
                                    padding:    prop.labelsAboveBackgroundPadding
                                });
                                
                                seq++;
                            }
                            
                            seq--;
                        }
                    }

                    --seq;
                }
            }
        };








        /**
        * Using a function to add events makes it easier to facilitate method
        * chaining
        * 
        * @param string   type The type of even to add
        * @param function func 
        */
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            RG.SVG.addCustomEventListener(this, type, func);
    
            return this;
        };








        //
        // Used in chaining. Runs a function there and then - not waiting for
        // the events to fire (eg the onbeforedraw event)
        // 
        // @param function func The function to execute
        //
        this.exec = function (func)
        {
            func(this);
            
            return this;
        };








        //
        // Remove highlight from the chart (tooltips)
        //
        this.removeHighlight = function ()
        {
            var highlight = RG.SVG.REG.get('highlight');
            if (highlight && highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
            
            RG.SVG.REG.set('highlight', null);
        };








        //
        // Calulate the center gutter size
        //
        this.getGutterCenter = function ()
        {
            var bold  = typeof prop.yaxisTextBold === 'boolean' ? prop.yaxisTextBold : prop.textBold,
                font  = typeof prop.yaxisTextFont === 'string'  ? prop.yaxisTextFont : prop.textFont,
                size  = typeof prop.yaxisTextSize === 'number'  ? prop.yaxisTextSize : prop.textSize,
                width = 0;

            // Loop through the labels measuring them
            if (prop.yaxisLabels) {

                for (var i=0,len=prop.yaxisLabels.length; i<len; ++i) {

                    width = ma.max(width, RG.SVG.measureText({
                        text: prop.yaxisLabels[i],
                        bold: bold,
                        font: font,
                        size: size
                    })[0]);

                }
            } else {
                var width = 50;
            }

            return width + 15;
        };








        //
        // Draw the title
        //
        this.drawTitle = function ()
        {
            if (RG.SVG.isNull(prop.titleX)) {
                prop.titleX = ((this.width - prop.gutterLeft - prop.gutterRight) / 2) + prop.gutterLeft;
            }

            RG.SVG.drawTitle(this);
        };







        //
        // The Bar chart grow effect
        //
        this.grow = function ()
        {
            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                obj      = this,
                left     = RG.SVG.arrayClone(this.left),
                right    = RG.SVG.arrayClone(this.right),
                seq      = 0;

            this.draw();

            var iterate = function ()
            {
                // LOOP THROUGH THE LEFT DATA
                for (var i=0,seq=0,len=obj.coordsLeft.length; i<len; ++i, ++seq) {

                    var   multiplier = (frame / frames)
                        * RG.SVG.FX.getEasingMultiplier(frames, frame)
                        * RG.SVG.FX.getEasingMultiplier(frames, frame);
                
                


                    // The main loop through the data
                    // LEFT REGULAR
                    if (typeof left[i] === 'number') {

                        width   = ma.abs(obj.getLeftXCoord(left[i]) - obj.getLeftXCoord(0));
                        left[i] = obj.left[i] * multiplier;

                        // Set the new height on the rect
                        obj.coordsLeft[i].element.setAttribute(
                            'width',
                            width
                        );

                        // Set the correct Y coord on the object
                        obj.coords[seq].element.setAttribute(
                            'x',
                            obj.getLeftXCoord(0) - width
                        );





                    // LEFT STACKED
                    } else if (typeof left[i] === 'object' && prop.grouping === 'stacked') {

                        var accumulativeWidth = 0;

                        for (var j=0,len2=left[i].length; j<len2; ++j, ++seq) {

                            width      = ma.abs(obj.getLeftXCoord(left[i][j]) - obj.getLeftXCoord(0));
                            left[i][j] = obj.left[i][j] * multiplier;

                            obj.coords[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coords[seq].element.setAttribute(
                                'x',
                                obj.getLeftXCoord(0) - width - accumulativeWidth
                            );

                            accumulativeWidth += (prop.grouping === 'stacked' ? width : 0);
                        }



                        //
                        // Set the width and X coord of the backfaces
                        //
                        if (obj.stackedBackfacesLeft[i]) {
                            obj.stackedBackfacesLeft[i].setAttribute(
                                'width',
                                accumulativeWidth
                            );
    
                            obj.stackedBackfacesLeft[i].setAttribute(
                                'x',
                                obj.getLeftXCoord(0) - accumulativeWidth
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;

                    // LEFT GROUPED
                    } else if (typeof left[i] === 'object' && prop.grouping === 'grouped') {

                        // Loop thru the group
                        for (var j=0,len2=left[i].length; j<len2; ++j, ++seq) {

                            width      = ma.abs(obj.getLeftXCoord(left[i][j]) - obj.getLeftXCoord(0));
                            left[i][j] = obj.left[i][j] * multiplier;

                            obj.coords[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coords[seq].element.setAttribute(
                                'x',
                                obj.getLeftXCoord(0) - width
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;
                    }
                }









                // LOOP THROUGH THE RIGHT DATA
                for (var i=0,seq=0,len=obj.coordsRight.length; i<len; ++i, ++seq) {

                    var   multiplier = (frame / frames)
                        * RG.SVG.FX.getEasingMultiplier(frames, frame)
                        * RG.SVG.FX.getEasingMultiplier(frames, frame);
                
                


                    // The main loop through the data
                    // RIGHT REGULAR
                    if (typeof right[i] === 'number') {

                        width    = ma.abs(obj.getRightXCoord(right[i]) - obj.getRightXCoord(0));
                        right[i] = obj.right[i] * multiplier;

                        // Set the new height on the rect
                        obj.coordsRight[i].element.setAttribute(
                            'width',
                            width
                        );

                        // Set the correct Y coord on the object
                        obj.coordsRight[seq].element.setAttribute(
                            'x',
                            obj.getRightXCoord(0)
                        );





                    // RIGHT STACKED
                    } else if (typeof right[i] === 'object' && prop.grouping === 'stacked') {

                        var accumulativeWidth = 0;

                        for (var j=0,len2=right[i].length; j<len2; ++j, ++seq) {

                            width      = ma.abs(obj.getRightXCoord(right[i][j]) - obj.getRightXCoord(0));
                            right[i][j] = obj.right[i][j] * multiplier;

                            obj.coordsRight[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coordsRight[seq].element.setAttribute(
                                'x',
                                obj.getRightXCoord(0) + accumulativeWidth
                            );

                            accumulativeWidth += width;
                        }



                        //
                        // Set the width and X coord of the backfaces
                        //
                        if (obj.stackedBackfacesRight[i]) {
                            obj.stackedBackfacesRight[i].setAttribute(
                                'width',
                                accumulativeWidth
                            );
    
                            obj.stackedBackfacesRight[i].setAttribute(
                                'x',
                                obj.getRightXCoord(0)
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;

                    // RIGHT GROUPED
                    } else if (typeof right[i] === 'object' && prop.grouping === 'grouped') {

                        // Loop thru the group
                        for (var j=0,len2=right[i].length; j<len2; ++j, ++seq) {

                            width      = ma.abs(obj.getRightXCoord(right[i][j]) - obj.getRightXCoord(0));
                            right[i][j] = obj.right[i][j] * multiplier;

                            obj.coordsRight[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coordsRight[seq].element.setAttribute(
                                'x',
                                obj.getRightXCoord(0)
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;
                    }
                }







                if (frame++ <= frames) {
                    RG.SVG.FX.update(iterate);
                } else if (opt.callback) {
                    (opt.callback)(obj);
                }
            };

            iterate();
            
            return this;
        };








        /**
        * HBar chart Wave effect.
        * 
        * @param object OPTIONAL An object map of options. You specify 'frames'
        *                        here to give the number of frames in the effect
        *                        and also callback to specify a callback function
        *                        thats called at the end of the effect
        */
        this.wave = function ()
        {
            var obj                   = this,
                opt                   = arguments[0] || {},
                frames                = opt.frames || 120,
                startFrames_left      = [],
                startFrames_right     = [],
                counters_left         = [],
                counters_right        = [];

            var framesperbar    = frames / 3,
                frame_left      = -1,
                frame_right     = -1,
                callback        = arguments[1] || function () {},
                original_left   = RG.SVG.arrayClone(this.left),
                original_right  = RG.SVG.arrayClone(this.right);

            for (var i=0,len=this.left.length,seq=0; i<len; i+=1,++seq) {

                startFrames_left[seq]  = ((frames / 3) / (RG.SVG.arrayLinearize(this.left).length - 1)) * i;
                startFrames_right[seq] = ((frames / 3) / (RG.SVG.arrayLinearize(this.right).length - 1)) * i;
                counters_left[seq]     = 0;
                counters_right[seq]    = 0;

                if (RG.SVG.isArray(this.left[i])) {
                    for (var j=0; j<this.left[i].length; ++j,seq++) {
                        startFrames_left[seq]  = ((frames / 3) / (RG.SVG.arrayLinearize(this.left).length - 1)) * seq;
                        startFrames_right[seq] = ((frames / 3) / (RG.SVG.arrayLinearize(this.right).length - 1)) * seq;
                        counters_left[seq]     = 0;
                        counters_right[seq]    = 0;
                    }
                    
                    --seq;
                }
            }




            // This stops the chart from jumping
            this.draw();


            // Zero all of the data and set all of the rect widths to zero
            for (var i=0,len=this.left.length; i<len; i+=1) {
                if (typeof this.left[i] === 'number') {
                    this.left[i]  = 0;
                    this.right[i] = 0;
                    this.coordsLeft[i].element.setAttribute('width', 0);
                    this.coordsRight[i].element.setAttribute('width', 0);
                } else if (typeof this.left[i] === 'object' && !RG.SVG.isNull(this.left[i])) {
                    for (var j=0; j<this.left[i].length; ++j) {
                        this.left[i][j]  = 0;
                        this.right[i][j] = 0;
                        this.coords2Left[i][j].element.setAttribute('width', 0);
                        this.coords2Right[i][j].element.setAttribute('width', 0);
                    }
                }
            }

            //
            // Iterate over the left side
            //
            function iteratorLeft ()
            {
                ++frame_left;

                for (var i=0,len=obj.left.length,seq=0; i<len; i+=1,seq+=1) {

                    if (frame_left >= startFrames_left[seq]) {

                        var isNull = RG.SVG.isNull(obj.left[i]);

                        // Regular bars
                        if (typeof obj.left[i] === 'number') {
                            
                            obj.left[i] = ma.min(
                                ma.abs(original_left[i]),
                                ma.abs(original_left[i] * ( (counters_left[i]++) / framesperbar))
                            );
                            
                            var rect_left = obj.coords[i].element;
                            
                            rect_left.setAttribute(
                                'width',
                                parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i] / rect_left.getAttribute('data-value'))
                            );
                            
                            rect_left.setAttribute(
                                'x',
                                obj.properties.gutterLeft + obj.graphWidth - (parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i] / rect_left.getAttribute('data-value')))
                            );


                        // Stacked or grouped bars
                        } else if (RG.SVG.isArray(obj.left[i])) {

                            for (var j=0,accWidth=0; j<obj.left[i].length; ++j,++seq) {

                                obj.left[i][j] = ma.min(
                                    ma.abs(original_left[i][j]),
                                    ma.abs(original_left[i][j] * ( (counters_left[seq]++) / framesperbar))
                                );

                                var rect_left = obj.coords[seq].element;

                                rect_left.setAttribute(
                                    'width',
                                    parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i][j] / rect_left.getAttribute('data-value'))
                                );

                                rect_left.setAttribute(
                                    'x',
                                    obj.properties.gutterLeft + obj.graphWidth - (parseFloat(rect_left.getAttribute('data-original-width')) * (obj.left[i][j] / rect_left.getAttribute('data-value'))) - accWidth
                                );
                                
                                // Only update this for stacked charts
                                if (obj.properties.grouping === 'stacked') {
                                    accWidth += parseFloat(rect_left.getAttribute('width'));
                                }
                            }
                            
                            seq--;
                        }
                            
                        if (isNull) {
                            obj.left[i] = null;
                        }
                    } else {
                        obj.left[i] = typeof obj.left[i] === 'object' && obj.left[i] ? RG.SVG.arrayPad([], obj.left[i].length, 0) : (RG.SVG.isNull(obj.left[i]) ? null : 0);
                    }
                }


                // No callback here - only called by the right function
                if (frame_left <= frames) {
                    RG.SVG.FX.update(iteratorLeft);
                }
            }












            //
            // Iterate over the left side
            //
            function iteratorRight ()
            {
                ++frame_right;

                for (var i=0,len=obj.right.length,seq=0; i<len; i+=1,seq+=1) {

                    if (frame_right >= startFrames_right[seq]) {

                        var isNull = RG.SVG.isNull(obj.right[i]);

                        // Regular bars
                        if (typeof obj.right[i] === 'number') {

                            obj.right[i] = ma.min(
                                ma.abs(original_right[i]),
                                ma.abs(original_right[i] * ( (counters_right[i]++) / framesperbar))
                            );

                            var rect_right = obj.coords[i + obj.left.length].element;

                            rect_right.setAttribute(
                                'width',
                                parseFloat(rect_right.getAttribute('data-original-width')) * (obj.right[i] / rect_right.getAttribute('data-value'))
                            );
                            
                            rect_right.setAttribute(
                                'x',
                                obj.properties.gutterLeft + obj.graphWidth + prop.gutterCenter
                            );

                        // Stacked or grouped bars
                        } else if (RG.SVG.isArray(obj.right[i])) {

                            for (var j=0,accWidth=0; j<obj.right[i].length; ++j,++seq) {

                                obj.right[i][j] = ma.min(
                                    ma.abs(original_right[i][j]),
                                    ma.abs(original_right[i][j] * ( (counters_right[seq]++) / framesperbar))
                                );

                                var rect_right = obj.coordsRight[seq].element;

                                rect_right.setAttribute(
                                    'width',
                                    parseFloat(rect_right.getAttribute('data-original-width')) * (obj.right[i][j] / rect_right.getAttribute('data-value'))
                                );

                                rect_right.setAttribute(
                                    'x',
                                    obj.properties.gutterLeft + obj.graphWidth + prop.gutterCenter + accWidth
                                );


                                
                                // Only update this for stacked charts
                                if (obj.properties.grouping === 'stacked') {
                                    accWidth += parseFloat(rect_right.getAttribute('width'));
                                }
                            }
                            
                            seq--;
                        }
                            
                        if (isNull) {
                            obj.right[i] = null;
                        }
                    } else {
                        obj.right[i] = typeof obj.right[i] === 'object' && obj.right[i] ? RG.SVG.arrayPad([], obj.right[i].length, 0) : (RG.SVG.isNull(obj.right[i]) ? null : 0);
                    }
                }


                // Call the callback if necessary
                if (frame_right <= frames) {
                    RG.SVG.FX.update(iteratorRight);
                } else {
                    // Fini - call the callback
                }
            }



            iteratorLeft();
            iteratorRight();

            return this;
        };








        //
        // Set the options that the user has provided
        //
        for (i in conf.options) {
            if (typeof i === 'string') {
                this.set(i, conf.options[i]);
            }
        }
    };
            
    return this;

// End module pattern
})(window, document);