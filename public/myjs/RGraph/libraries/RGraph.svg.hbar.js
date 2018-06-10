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



    RG.SVG.HBar = function (conf)
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








        this.id               = conf.id;
        this.uid              = RG.SVG.createUID();
        this.container        = document.getElementById(this.id);
        this.layers           = {}; // MUST be before the SVG tag is created!
        this.svg              = RG.SVG.createSVG({object: this,container: this.container});
        this.isRGraph         = true;
        this.width            = Number(this.svg.getAttribute('width'));
        this.height           = Number(this.svg.getAttribute('height'));
        this.data             = conf.data;
        this.type             = 'hbar';
        this.coords           = [];
        this.coords2          = [];
        this.stackedBackfaces = [];
        this.colorsParsed     = false;
        this.originalColors   = {};
        this.gradientCounter  = 1;
        
        // Add this object to the ObjectRegistry
        RG.SVG.OR.add(this);
        
        this.container.style.display = 'inline-block';

        this.properties =
        {
            gutterLeft:   100,
            gutterRight:  35,
            gutterTop:    35,
            gutterBottom: 35,
            gutterLeftAutosize: true,

            backgroundColor:            null,
            backgroundImage:            null,
            backgroundImageAspect:      'none',
            backgroundImageStretch:     true,
            backgroundImageOpacity:     null,
            backgroundImageX:           null,
            backgroundImageY:           null,
            backgroundImageW:           null,
            backgroundImageH:           null,
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
            
            // 20 colors. If you need more you need to set the colors property
            colors: [
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black',
                'red', '#0f0', '#00f', '#ff0', '#0ff', '#0f0','pink','orange','gray','black'
            ],
            colorsSequential:     false,
            strokestyle:          'rgba(0,0,0,0)',

            vmargin:              3,
            vmarginGrouped:       2,
            vmarginTop:           0,
            vmarginBottom:        0,

            xaxis:                true,
            xaxisTickmarks:       true,
            xaxisTickmarksLength: 5,
            xaxisColor:           'black',
            xaxisLabels:          [],
            xaxisLabelsOffsetx:   0,
            xaxisLabelsOffsety:   0,
            xaxisLabelsCount:     5,
            xaxisScale:           true,
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
            xaxisLabelsPositionEdgeTickmarksCount: null,
            xaxisTextColor:       null,
            xaxisTextBold:        null,
            xaxisTextItalic:      null,
            xaxisTextFont:        null,
            xaxisTextSize:        null,

            yaxis:                true,
            yaxisTickmarks:       true,
            yaxisTickmarksLength: 3,
            yaxisLabels:          [],
            yaxisLabelsPosition:  'section',
            yaxisLabelsOffsetx:   0,
            yaxisLabelsOffsety:   0,
            yaxisScale:           false,
            yaxisLabelsPositionSectionTickmarksCount: null,
            yaxisColor:           'black',
            yaxisTextFont:        null,
            yaxisTextSize:        null,
            yaxisTextColor:       null,
            yaxisTextBold:        null,
            yaxisTextItalic:      null,
            
            textColor:            'black',
            textFont:             'sans-serif',
            textSize:             12,
            textBold:             false,
            textItalic:           false,
            
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
            labelsAboveHalign:            'left',
            labelsAboveValign:            'center',
            labelsAboveSpecific:          null,

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
            titleSubtitleX:       null,
            titleSubtitleY:       null,
            titleSubtitleHalign:  'center',
            titleSubtitleValign:  null,
            titleSubtitleColor:   '#aaa',
            titleSubtitleSize:    10,
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
            keyTextItalic:  null
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
            
            this.coords  = [];
            this.coords2 = [];



            // Create the defs tag if necessary
            RG.SVG.createDefs(this);



            //
            // Handle the gutterLeft autosizing
            //
            if (prop.gutterLeftAutosize) {
                for (var i=0,len=prop.yaxisLabels.length,maxLength=0; i<len; ++i) {
                    var sizes = RG.SVG.measureText({
                        text: prop.yaxisLabels[i],
                        bold: prop.yaxisTextBold || prop.textBold,
                        size: prop.yaxisTextSize || prop.textSize,
                        font: prop.yaxisTextFont || prop.textFont
                    });
                    
                    maxLength = ma.max(maxLength, sizes[0]);
                }
                
                prop.gutterLeft = maxLength + 15 - prop.yaxisLabelsOffsetx;
                
                // Minimum left gutter of 15
                if (prop.gutterLeft < 15) {
                    prop.gutterLeft = 15;
                }
            }




            this.graphWidth  = this.width - prop.gutterLeft - prop.gutterRight;
            this.graphHeight = this.height - prop.gutterTop - prop.gutterBottom;



            // Parse the colors for gradients
            RG.SVG.resetColorsToOriginalValues({object:this});
            this.parseColors();



            // Go through the data and work out the maximum value
            var values = [];

            for (var i=0,max=0; i<this.data.length; ++i) {
                if (typeof this.data[i] === 'number') {
                    values.push(this.data[i]);
                
                } else if (RG.SVG.isArray(this.data[i]) && prop.grouping === 'grouped') {
                    values.push(RG.SVG.arrayMax(this.data[i]));

                } else if (RG.SVG.isArray(this.data[i]) && prop.grouping === 'stacked') {
                    values.push(RG.SVG.arraySum(this.data[i]));
                }
            }
            var max = RG.SVG.arrayMax(values);

            // A custom, user-specified maximum value
            if (typeof prop.xaxisMax === 'number') {
                max = prop.xaxisMax;
            }
            
            // Set the ymin to zero if it's set to mirror
            if (prop.xaxisMin === 'mirror' || prop.xaxisMin === 'middle' || prop.xaxisMin === 'center') {
                var mirrorScale = true;
                prop.xaxisMin   = prop.xaxisMax * -1;
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



            //
            // Get the scale a second time if the xmin should be mirored
            //
            // Set the xmin to zero if it's set mirror
            if (mirrorScale) {
                this.scale = RG.SVG.getScale({
                    object: this,
                    numlabels: prop.xaxisLabelsCount,
                    unitsPre:  prop.xaxisUnitsPre,
                    unitsPost: prop.xaxisUnitsPost,
                    max:       this.scale.max,
                    min:       this.scale.max * -1,
                    point:     prop.xaxisPoint,
                    round:     false,
                    thousand:  prop.xaxisThousand,
                    decimals:  prop.xaxisDecimals,
                    strict:    typeof prop.xaxisMax === 'number',
                    formatter: prop.xaxisFormatter
                });
            }

            // Now the scale has been generated adopt its max value
            this.max      = this.scale.max;
            prop.xaxisMax = this.scale.max;

            this.min      = this.scale.min;
            prop.xaxisMin = this.scale.min;




            // Draw the background first
            RG.SVG.drawBackground(this);

            // Draw the bars
            this.drawBars();


            // Draw the axes over the bars
            RG.SVG.drawXAxis(this);
            RG.SVG.drawYAxis(this);


            // Draw the labelsAbove
            this.drawLabelsAbove();






            // Draw the key
            if (typeof prop.key !== null && RG.SVG.drawKey) {
                RG.SVG.drawKey(this);
            } else if (!RGraph.SVG.isNull(prop.key)) {
                alert('The drawKey() function does not exist - have you forgotten to include the key library?');
            }




            
            
            // Add the attribution link. If you're adding this elsewhere on your page/site
            // and you don't want it displayed then there are options available to not
            // show it.
            RG.SVG.attribution(this);



            // Add the event listener that clears the highlight rect if
            // there is any. Must be MOUSEDOWN (ie before the click event)
            var obj = this;
            document.body.addEventListener('mousedown', function (e)
            {
                RG.SVG.removeHighlight(obj);

            }, false);



            // Fire the draw event
            RG.SVG.fireCustomEvent(this, 'ondraw');




            return this;
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

            // Go through the bars
            for (var i=0,sequentialIndex=0; i<this.data.length; ++i,++sequentialIndex) {

                //
                // NORMAL bars
                //
                if (typeof this.data[i] === 'number') {

                    var outerSegment = (this.graphHeight - prop.vmarginTop - prop.vmarginBottom) / this.data.length,
                        width        = this.getWidth(this.data[i]),
                        height       = ( (this.graphHeight - prop.vmarginTop - prop.vmarginBottom) / this.data.length) - prop.vmargin - prop.vmargin,
                        x            = this.getXCoord(
                                            (this.scale.min < 0 && this.scale.max < 0) || (this.scale.min > 0 && this.scale.max > 0) ? this.scale.min : 0
                                        ) - (this.data[i] <  0 ? width : 0),
                        y            = prop.gutterTop + prop.vmarginTop + prop.vmargin + (outerSegment * i);

                    // If theres a min set but both the min and max are below
                    // zero the the bars should be aligned to the right hand
                    // side
                    if (this.scale.min < 0 && this.scale.max < 0) {
                        x = this.width - prop.gutterRight - width;
                    }

                    var rect = RG.SVG.create({
                        svg: this.svg,
                        parent: this.svg.all,
                        type: 'rect',
                        attr: {
                            stroke: prop.strokestyle,
                            fill: prop.colorsSequential ? (prop.colors[sequentialIndex] ? prop.colors[sequentialIndex] : prop.colors[prop.colors.length - 1]) : prop.colors[0],
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                            'stroke-width': prop.linewidth,
                            'data-tooltip': (!RG.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[i] : '',
                            'data-index': i,
                            'data-original-width': width,
                            'data-original-height': height,
                            'data-sequential-index': sequentialIndex,
                            'data-value': this.data[i],
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
                    
                    if (!this.coords2[0]) {
                        this.coords2[0] = [];
                    }

                    this.coords2[0].push({
                        object:  this,
                        element: rect,
                        x:      parseFloat(rect.getAttribute('x')),
                        y:      parseFloat(rect.getAttribute('y')),
                        width:  parseFloat(rect.getAttribute('width')),
                        height: parseFloat(rect.getAttribute('height'))
                    });





                    // Add toooltips if necessary
                    if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[sequentialIndex]) {

                        var obj = this;

                        //
                        // Add tooltip event listeners
                        //
                        (function (idx, seq)
                        {
                            rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                            {
                                obj.removeHighlight();

                                // Show the tooltip
                                RG.SVG.tooltip({
                                    object: obj,
                                    index: idx,
                                    group: null,
                                    sequentialIndex: seq,
                                    text: prop.tooltips[seq],
                                    event: e
                                });
                                
                                // Highlight the rect that has been clicked on
                                obj.highlight(e.target);
                            }, false);
                            
                            rect.addEventListener('mousemove', function (e)
                            {
                                e.target.style.cursor = 'pointer';
                            }, false);
                        })(i, sequentialIndex);
                    }




                //
                // GROUPED charts
                //
                } else if (RG.SVG.isArray(this.data[i]) && prop.grouping === 'grouped') {

                    var outerSegment = ( (this.graphHeight - prop.vmarginTop - prop.vmarginBottom) / this.data.length),
                        innerSegment = outerSegment - (2 * prop.vmargin);

                    // Loop through the group
                    for (var j=0; j<this.data[i].length; ++j,++sequentialIndex) {

                        var width  = ma.abs((this.data[i][j] / (this.max - this.min)) * this.graphWidth),
                            height = ( (innerSegment - ((this.data[i].length - 1) * prop.vmarginGrouped)) / this.data[i].length),
                            y      = prop.gutterTop + prop.vmargin + prop.vmarginTop + (outerSegment * i) + (j * height) + (j * prop.vmarginGrouped),
                            x      = this.getXCoord(0) - (this.data[i][j] <  0 ? width : 0);









                        // Work out some coordinates for the width and X coords ///////////////////////
                        if (this.scale.max < 0 && this.scale.min < this.scale.max) {
                            var x1 = this.getXCoord(this.data[i][j]);
                            var x2 = this.getXCoord(this.scale.max);
                            x      = x1;
                            width  = x2 - x1;
                        
                        } else if (this.scale.min > 0 && this.scale.max > this.scale.min) {
                            var x1 = this.getXCoord(this.data[i][j]);
                            var x2 = this.getXCoord(this.scale.min);
                            x      = this.getXCoord(this.scale.min);
                            width  = x1 - x2;

                        }
                        //////////////////////////////////////////////////////////////////////////////










                        var rect = RG.SVG.create({
                            svg: this.svg,
                            type: 'rect',
                            parent: this.svg.all,
                            attr: {
                                stroke: prop['strokestyle'],
                                fill: (prop.colorsSequential && prop.colors[sequentialIndex]) ? prop.colors[sequentialIndex] : (prop.colors[j] ? prop.colors[j] : prop.colors[prop.colors.length - 1]),
                                x: x,
                                y: y,
                                width: width,
                                height: height,
                                'stroke-width': prop.linewidth,
                                'data-index': i,
                                'data-original-width': width,
                                'data-sequential-index': sequentialIndex,
                                'data-tooltip': (!RG.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[sequentialIndex] : '',
                                'data-value': this.data[i][j],
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

                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }
        
                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });


                        // Add the tooltip data- attribute
                        if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[sequentialIndex]) {
                        
                            var obj = this;
    
                        
                            //
                            // Add tooltip event listeners
                            //
                            (function (idx, seq)
                            {
                                var indexes = RG.SVG.sequentialIndexToGrouped(seq, obj.data);

                                rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                                {
                                    obj.removeHighlight();

                                    // Show the tooltip
                                    RG.SVG.tooltip({
                                        object: obj,
                                        group: idx,
                                        index: indexes[1],
                                        sequentialIndex: seq,
                                        text: prop.tooltips[seq],
                                        event: e
                                    });
                                    
                                    // Highlight the rect that has been clicked on
                                    obj.highlight(e.target);
    
                                }, false);
                                
                                rect.addEventListener('mousemove', function (e)
                                {
                                    e.target.style.cursor = 'pointer'
                                }, false);
                            })(i, sequentialIndex);
                        }
                    }

                    --sequentialIndex;
                        


                //
                // STACKED CHARTS
                //
                } else if (RG.SVG.isArray(this.data[i]) && prop.grouping === 'stacked') {

                    // This is each bars "segment" of the chart
                    var section = ( (this.graphHeight - prop.vmarginTop - prop.vmarginBottom) / this.data.length);

                    
                    // Intialise the X and Y coordinates
                    var x = this.getXCoord(0);

                    

                    // Loop through the stack
                    for (var j=0; j<this.data[i].length; ++j,++sequentialIndex) {

                        var outerHeight = (this.graphHeight - prop.vmarginTop - prop.vmarginBottom) / this.data.length,
                            width       = ma.abs((this.data[i][j] / (this.max - this.min)) * this.graphWidth),
                            height      = outerHeight - (2 * prop.vmargin),
                            y           = prop.gutterTop + prop.vmargin + prop.vmarginTop + (outerHeight * i);

                        // If this is the first iteration of the loop and a shadow
                        // is requested draw a rect here to create it.
                        if (j === 0 && prop.shadow) {
                            
                            var fullWidth = ma.abs((RG.SVG.arraySum(this.data[i]) / (this.max - this.min)) * this.graphWidth);

                            var rect = RG.SVG.create({
                                svg: this.svg,
                                parent: this.svg.all,
                                type: 'rect',
                                attr: {
                                    x: x,
                                    y: y,
                                    width: fullWidth,
                                    height: height,
                                    fill: 'white',
                                    'stroke-width': 0,
                                    'data-index': i,
                                    filter: 'url(#dropShadow)'
                                }
                            });
                            
                            this.stackedBackfaces[i] = rect;
                        }



                        // Create the visible bar
                        var rect = RG.SVG.create({
                            svg: this.svg,
                            type: 'rect',
                            parent: this.svg.all,
                            attr: {
                                stroke: prop['strokestyle'],
                                fill: prop.colorsSequential ? (prop.colors[sequentialIndex] ? prop.colors[sequentialIndex] : prop.colors[prop.colors.length - 1]) : (prop.colors[j] ? prop.colors[j] : prop.colors[prop.colors.length - 1]),
                                x: x,
                                y: y,
                                width: width,
                                height: height,
                                'stroke-width': prop.linewidth,
                                'data-original-width': width,
                                'data-original-height': height,
                                'data-original-x': x,
                                'data-original-y': y,
                                'data-index': i,
                                'data-sequential-index': sequentialIndex,
                                'data-tooltip': (!RG.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[sequentialIndex] : '',
                                'data-value': this.data[i][j]
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

                        if (!this.coords2[i]) {
                            this.coords2[i] = [];
                        }
        
                        this.coords2[i].push({
                            object:  this,
                            element: rect,
                            x:      parseFloat(rect.getAttribute('x')),
                            y:      parseFloat(rect.getAttribute('y')),
                            width:  parseFloat(rect.getAttribute('width')),
                            height: parseFloat(rect.getAttribute('height'))
                        });



                        // Add the tooltips 
                        if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[sequentialIndex]) {
                        
                            var obj = this;
    
                        
                            //
                            // Add tooltip event listeners
                            //
                            (function (idx, seq)
                            {
                                rect.addEventListener(prop.tooltipsEvent.replace(/^on/, ''), function (e)
                                {
                                    obj.removeHighlight();

                                    var indexes = RG.SVG.sequentialIndexToGrouped(seq, obj.data);

                                    // Show the tooltip
                                    RG.SVG.tooltip({
                                        object: obj,
                                        index: indexes[1],
                                        group: idx,
                                        sequentialIndex: seq,
                                        text: prop.tooltips[seq],
                                        event: e
                                    });
                                    
                                    // Highlight the rect that has been clicked on
                                    obj.highlight(e.target);
                                }, false);
                                
                                rect.addEventListener('mousemove', function (e)
                                {
                                    e.target.style.cursor = 'pointer'
                                }, false);
                            })(i, sequentialIndex);
                        }
                        
                        x += width;
                    }

                    --sequentialIndex;
                }
            }

        };









        /**
        * This function can be used to retrieve the relevant X coordinate for a
        * particular value.
        * 
        * @param int value The value to get the X coordinate for
        */
        this.getXCoord = function (value)
        {
            var prop = this.properties;

            if (value > this.scale.max) {
                return null;
            }

            var x;

            if (value < this.scale.min) {
                return null;
            }

            x  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            x *= this.graphWidth;
            x += prop.gutterLeft;

            return x;
        };









        /**
        * This function can be used to retrieve the relevant X coordinate for a
        * particular value.
        * 
        * @param int value The value to get the X coordinate for
        */
        this.getWidth = function (value)
        {
            if (this.scale.max <= 0 && this.scale.min < this.scale.max) {
                var x1 = this.getXCoord(this.scale.max);
                var x2 = this.getXCoord(value);
            
            } else if (this.scale.min > 0 && this.scale.max > this.scale.min) {
                var x1 = this.getXCoord(this.scale.min);
                var x2 = this.getXCoord(value);
            
            } else {
                var x1 = this.getXCoord(0);
                var x2 = this.getXCoord(value);
            }

            return ma.abs(x1 - x2);
        };
        
        //ma.abs(((this.data[i] - this.scale.min) / (this.max - this.scale.min)) * this.graphWidth)








        /**
        * This function can be used to highlight a bar on the chart
        * 
        * @param object rect The rectangle to highlight
        */
        this.highlight = function (rect)
        {
            var x      = rect.getAttribute('x'),
                y      = rect.getAttribute('y'),
                width  = rect.getAttribute('width'),
                height = rect.getAttribute('height');
            
            var highlight = RG.SVG.create({
                svg: this.svg,
                type: 'rect',
                parent: this.svg.all,
                attr: {
                    stroke: prop.highlightStroke,
                    fill: prop.highlightFill,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    'stroke-width': prop.highlightLinewidth
                },
                style: {
                    pointerEvents: 'none'
                }
            });


            //if (prop.tooltipsEvent === 'mousemove') {
            //    highlight.addEventListener('mouseout', function (e)
            //    {
            //        highlight.parentNode.removeChild(highlight);
            //        RG.SVG.hideTooltip();

            //        RG.SVG.REG.set('highlight', null);
            //    }, false);
            //}


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
                        direction: 'horizontal',
                        start: prop.gutterLeft,
                        end: this.width - prop.gutterRight
                    });
                }
            }

            prop.backgroundGridColor = RG.SVG.parseColorLinear({object: this, color: prop.backgroundGridColor, direction: 'horizontal',start: prop.gutterLeft,end: this.width - prop.gutterRight});
            prop.highlightFill       = RG.SVG.parseColorLinear({object: this, color: prop.highlightFill, direction: 'horizontal',start: prop.gutterLeft,end: this.width - prop.gutterRight});
            prop.backgroundColor     = RG.SVG.parseColorLinear({object: this, color: prop.backgroundColor});
        };








        //
        // Draws the labelsAbove
        //
        this.drawLabelsAbove = function ()
        {
            // Go through the above labels
            if (prop.labelsAbove) {
                
                var data = RG.SVG.arrayLinearize(this.data);

                for (var i=0; i<this.coords.length; ++i) {

                    var value = data[i].toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : prop.xaxisDecimals);
                    var indexes = RG.SVG.sequentialIndexToGrouped(i, this.data);



                    if (RG.SVG.isArray(this.data[indexes[0]]) && prop.grouping === 'stacked') {
                        if ((indexes[1] +1) === this.data[indexes[0]].length) {
                            value = RG.SVG.arraySum(this.data[indexes[0]]);
                            value = value.toFixed(typeof prop.labelsAboveDecimals === 'number' ? prop.labelsAboveDecimals : prop.xaxisDecimals);
                        } else {
                            continue;
                        }
                    }


                    var str = prop.labelsAboveSpecific ? prop.labelsAboveSpecific[i].toString() : RG.SVG.numberFormat({
                        object:    this,
                        num:       value,
                        prepend:   typeof prop.labelsAboveUnitsPre  === 'string'   ? prop.labelsAboveUnitsPre  : null,
                        append:    typeof prop.labelsAboveUnitsPost === 'string'   ? prop.labelsAboveUnitsPost : null,
                        point:     typeof prop.labelsAbovePoint     === 'string'   ? prop.labelsAbovePoint     : null,
                        thousand:  typeof prop.labelsAboveThousand  === 'string'   ? prop.labelsAboveThousand  : null,
                        formatter: typeof prop.labelsAboveFormatter === 'function' ? prop.labelsAboveFormatter : null
                    });

                    var bold   = typeof prop.labelsAboveBold   === 'boolean' ? prop.labelsAboveBold   : prop.textBold,
                        italic = typeof prop.labelsAboveItalic === 'boolean' ? prop.labelsAboveItalic : prop.textItalic,
                        size   = prop.labelsAboveSize || prop.textSize,
                        font   = prop.labelsAboveFont || prop.textFont,
                        halign = prop.labelsAboveHalign,
                        valign = prop.labelsAboveValign;
                    
                    var dimensions = RG.SVG.measureText({
                        text: str,
                        bold: bold,
                        font: font,
                        size: size
                    });

                    var x      = (value >= 0)
                                   ? (parseFloat(this.coords[i].element.getAttribute('x')) + parseFloat(this.coords[i].element.getAttribute('width')) + 7 + prop.labelsAboveOffsetx)
                                   : parseFloat(this.coords[i].element.getAttribute('x') - 7 - prop.labelsAboveOffsetx),
                        y      = parseFloat(this.coords[i].element.getAttribute('y')) + parseFloat(this.coords[i].element.getAttribute('height') / 2) + prop.labelsAboveOffsety,
                        width  = dimensions[0],
                        height = dimensions[1],
                        halign = (value >= 0) ? 'left': 'right';

                    if (x + width > this.width && value > 0) {
                        halign = 'right';
                        x      = this.width - 5;
                        prop.labelsAboveBackground = prop.labelsAboveBackground || 'rgba(255,255,255,0.95)';
                    }


                    var text = RG.SVG.text({
                        object:     this,
                        parent:     this.svg.all,
                        tag:        'labels.above',
                        text:       str,
                        x:          x,
                        y:          y,
                        halign:     halign,
                        valign:     valign,
                        font:       font,
                        size:       size,
                        bold:       bold,
                        italic:     italic,
                        color:      prop.labelsAboveColor             || prop.textColor,
                        background: prop.labelsAboveBackground        || null,
                        padding:    prop.labelsAboveBackgroundPadding || 0
                    });
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
        // The Bar chart grow effect
        //
        this.grow = function ()
        {
            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                obj      = this,
                data     = [],
                height   = null,
                seq      = 0;

            //
            // Copy the data
            //
            data = RG.SVG.arrayClone(this.data);

            this.draw();

            var iterate = function ()
            {
                for (var i=0,seq=0,len=obj.coords.length; i<len; ++i, ++seq) {

                    var   multiplier = (frame / frames)
                        * RG.SVG.FX.getEasingMultiplier(frames, frame)
                        * RG.SVG.FX.getEasingMultiplier(frames, frame);
                
                
                
                
                    // TODO Go through the data and update the value according to
                    // the frame number
                    if (typeof data[i] === 'number') {

                        width       = ma.abs(obj.getXCoord(data[i]) - obj.getXCoord(0));
                        obj.data[i] = data[i] * multiplier;
                        width       = multiplier * width;
                        
                        // Set the new width on the rect
                        obj.coords[seq].element.setAttribute(
                            'width',
                            width
                        );

                        // Set the correct Y coord on the object
                        obj.coords[seq].element.setAttribute(
                            'x',
                            data[i] > 0 ? obj.getXCoord(0) : obj.getXCoord(0) - width
                        );

                    } else if (typeof data[i] === 'object') {

                        var accumulativeWidth = 0;

                        for (var j=0,len2=data[i].length; j<len2; ++j, ++seq) {

                            width          = ma.abs(obj.getXCoord(data[i][j]) - obj.getXCoord(0));
                            width          = multiplier * width;
                            obj.data[i][j] = data[i][j] * multiplier;

                            obj.coords[seq].element.setAttribute(
                                'width',
                                width
                            );

                            obj.coords[seq].element.setAttribute(
                                'x',
                                data[i][j] > 0 ? (obj.getXCoord(0) + accumulativeWidth) : (obj.getXCoord(0) - width - accumulativeWidth)
                            );
                            
                            accumulativeWidth += (prop.grouping === 'stacked' ? width : 0);
                        }

                        //
                        // Set the height and Y cooord of the backfaces if necessary
                        //
                        if (obj.stackedBackfaces[i]) {
                            obj.stackedBackfaces[i].setAttribute(
                                'width',
                                accumulativeWidth
                            );

                            obj.stackedBackfaces[i].setAttribute(
                                'x',
                                prop.gutterLeft
                            );
                        }

                        // Decrease seq by one so that it's not incremented twice
                        --seq;
                    }
                }

                if (frame++ < frames) {
                    //setTimeout(iterate, frame > 1 ? opt.delay : 200);
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
            // First draw the chart
            this.draw();


            var obj = this,
                opt = arguments[0] || {};
            
            opt.frames      = opt.frames || 60;
            opt.startFrames = [];
            opt.counters    = [];

            var framesperbar    = opt.frames / 3,
                frame           = -1,
                callback        = opt.callback || function () {},
                width;

            for (var i=0,len=this.coords.length; i<len; i+=1) {
                opt.startFrames[i] = ((opt.frames / 2) / (obj.coords.length - 1)) * i;
                opt.counters[i]    = 0;
                
                // Now zero the width of the bar
                this.coords[i].element.setAttribute('width', 0);
            }


            function iterator ()
            {
                ++frame;

                for (var i=0,len=obj.coords.length; i<len; i+=1) {
                    if (frame > opt.startFrames[i]) {                            
                        
                        var originalWidth = obj.coords[i].element.getAttribute('data-original-width'),
                            value         = parseFloat(obj.coords[i].element.getAttribute('data-value'));

                        obj.coords[i].element.setAttribute(
                            'width',
                            width = ma.min(
                                ((frame - opt.startFrames[i]) / framesperbar) * originalWidth,
                                originalWidth
                            )
                        );
                        
                        obj.coords[i].element.setAttribute(
                            'x',
                            value >=0 ? obj.getXCoord(0) : obj.getXCoord(0) - width
                        );
                        
                        
                        if (prop.grouping === 'stacked') {
                            var seq = obj.coords[i].element.getAttribute('data-sequential-index');
                            var indexes = RG.SVG.sequentialIndexToGrouped(seq, obj.data);
                            
                            if (indexes[1] > 0) {
                                obj.coords[i].element.setAttribute(
                                    'x',
                                    parseInt(obj.coords[i - 1].element.getAttribute('x')) + parseInt(obj.coords[i - 1].element.getAttribute('width'))
                                );
                            }
                        }
                    }
                }


                if (frame >= opt.frames) {
                    callback(obj);
                } else {
                    RG.SVG.FX.update(iterator);
                }
            }
            
            iterator();

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