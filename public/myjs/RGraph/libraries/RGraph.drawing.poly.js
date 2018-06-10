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
    
    /**
    * Having this here means that the RGraph libraries can be included in any order, instead of you having
    * to include the common core library first.
    */

    // Define the RGraph global variable
    RGraph = window.RGraph || {isRGraph: true};
    RGraph.Drawing = RGraph.Drawing || {};

    /**
    * The constructor. This function sets up the object. It takes the ID (the HTML attribute) of the canvas as the
    * first argument, then the coordinates of the coords of the shape
    * 
    * @param string id     The canvas tag ID
    * @param number coords The coordinates of the shape
    */
    RGraph.Drawing.Poly = function (conf)
    {
        /**
        * Allow for object config style
        */
        if (   typeof conf        === 'object'
            && typeof conf.coords === 'object'
            && typeof conf.id     === 'string') {

            var id                        = conf.id,
                coords                    = conf.coords,
                parseConfObjectForOptions = true; // Set this so the config is parsed (at the end of the constructor)
        } else {
            var id     = conf,
                coords = arguments[1];
        }




        this.id                = id;
        this.canvas            = document.getElementById(this.id);
        this.context           = this.canvas.getContext('2d');
        this.colorsParsed      = false;
        this.canvas.__object__ = this;
        this.coords            = coords;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false


        /**
        * This defines the type of this shape
        */
        this.type = 'drawing.poly';


        /**
        * This facilitates easy object identification, and should always be true
        */
        this.isRGraph = true;


        /**
        * This adds a uid to the object that you can use for identification purposes
        */
        this.uid = RGraph.createUID();


        /**
        * This adds a UID to the canvas for identification purposes
        */
        this.canvas.uid = this.canvas.uid ? this.canvas.uid : RGraph.createUID();




        /**
        * Some example background properties
        */
        this.properties =
        {
            'chart.linewidth':               1,
            'chart.strokestyle':             'black',
            'chart.fillstyle':               'red',
            'chart.events.click':            null,
            'chart.events.mousemove':        null,
            'chart.tooltips':                null,
            'chart.tooltips.override':       null,
            'chart.tooltips.effect':         'fade',
            'chart.tooltips.css.class':      'RGraph_tooltip',
            'chart.tooltips.event':          'onclick',
            'chart.tooltips.highlight':      true,
            'chart.highlight.stroke':        'rgba(0,0,0,0)',
            'chart.highlight.fill':          'rgba(255,255,255,0.7)',
            'chart.shadow':                  false,
            'chart.shadow.color':            'rgba(0,0,0,0.2)',
            'chart.shadow.offsetx':          3,
            'chart.shadow.offsety':          3,
            'chart.shadow.blur':             5,
            'chart.clearto':   'rgba(0,0,0,0)'
        }

        /**
        * A simple check that the browser has canvas support
        */
        if (!this.canvas) {
            alert('[DRAWING.POLY] No canvas support');
            return;
        }
        
        /**
        * Create the dollar object so that functions can be added to them
        */
        this.$0 = {};


        /**
        * Translate half a pixel for antialiasing purposes - but only if it hasn't beeen
        * done already
        */
        if (!this.canvas.__rgraph_aa_translated__) {
            this.context.translate(0.5,0.5);
            this.canvas.__rgraph_aa_translated__ = true;
        }




        // Short variable names
        var RG   = RGraph,
            ca   = this.canvas,
            co   = ca.getContext('2d'),
            prop = this.properties,
            pa2  = RG.path2,
            win  = window,
            doc  = document,
            ma   = Math;
        
        
        
        /**
        * "Decorate" the object with the generic effects if the effects library has been included
        */
        if (RG.Effects && typeof RG.Effects.decorate === 'function') {
            RG.Effects.decorate(this);
        }




        /**
        * A setter method for setting properties.
        * 
        * @param name  string The name of the property to set OR it can be a map
        *                     of name/value settings like what you set in the constructor
        */
        this.set =
        this.Set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];

            /**
            * the number of arguments is only one and it's an
            * object - parse it for configuration data and return.
            */
            if (arguments.length === 1 && typeof name === 'object') {
                RG.parseObjectStyleConfig(this, name);
                return this;
            }




    
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }




            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }





    
            prop[name] = value;
    
            return this;
        };




        /**
        * A getter method for retrieving graph properties. It can be used like this: obj.Get('chart.strokestyle');
        * 
        * @param name  string The name of the property to get
        */
        this.get =
        this.Get = function (name)
        {
            /**
            * This should be done first - prepend the property name with "chart." if necessary
            */
            if (name.substr(0,6) != 'chart.') {
                name = 'chart.' + name;
            }

            // Convert uppercase letters to dot+lower case letter
            while(name.match(/([A-Z])/)) {
                name = name.replace(/([A-Z])/, '.' + RegExp.$1.toLowerCase());
            }
    
            return prop[name.toLowerCase()];
        };




        /**
        * Draws the shape
        */
        this.draw =
        this.Draw = function ()
        {
            /**
            * Fire the onbeforedraw event
            */
            RG.fireCustomEvent(this, 'onbeforedraw');
    
    
            /**
            * Parse the colors. This allows for simple gradient syntax
            */
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    
    



            /**
            * Stop this growing uncontrollably
            */
            this.coordsText = [];




    
            /**
            * DRAW THE SHAPE HERE
            */

            if (prop['chart.shadow']) {
                co.shadowColor   = prop['chart.shadow.color'];
                co.shadowOffsetX = prop['chart.shadow.offsetx'];
                co.shadowOffsetY = prop['chart.shadow.offsety'];
                co.shadowBlur    = prop['chart.shadow.blur'];
            }

            co.strokeStyle = prop['chart.strokestyle'];
            co.fillStyle   = prop['chart.fillstyle'];

            this.drawPoly();
            
            co.lineWidth = prop['chart.linewidth'];
            RG.noShadow(this);
    
    
    
            /**
            * This installs the event listeners
            */
            RG.installEventListeners(this);
    

            /**
            * Fire the onfirstdraw event
            */
            if (this.firstDraw) {
                this.firstDraw = false;
                RG.fireCustomEvent(this, 'onfirstdraw');
                this.firstDrawFunc();
            }




            /**
            * Fire the ondraw event
            */
            RG.fireCustomEvent(this, 'ondraw');

            return this;
        };
        
        
        
        /**
        * Used in chaining. Runs a function there and then - not waiting for
        * the events to fire (eg the onbeforedraw event)
        * 
        * @param function func The function to execute
        */
        this.exec = function (func)
        {
            func(this);
            
            return this;
        };




        /**
        * The getObjectByXY() worker method
        */
        this.getObjectByXY = function (e)
        {
            if (this.getShape(e)) {
                return this;
            }
        };




        /**
        * Draw the Poly but doesn't stroke or fill - that's left to other functions
        */
        this.drawPoly =
        this.DrawPoly = function ()
        {
            var coords = this.coords;
            
            pa2(co, ['b','m',coords[0][0], coords[0][1]]);

            // Draw lines to subsequent coords
            for (var i=1,len=coords.length; i<len; ++i) {
                co.lineTo(coords[i][0],coords[i][1]);
            }

            // Close the path and stroke/fill it with whatever the current fill/stroke styles are
            pa2(co, ['lw', prop['chart.linewidth'], 'c','f',co.fillStyle, 's',co.strokeStyle]);
        };




        /**
        * Not used by the class during creating the graph, but is used by event handlers
        * to get the coordinates (if any) of the selected bar
        * 
        * @param object e The event object
        */
        this.getShape = function (e)
        {
            var coords  = this.coords,
                mouseXY = RG.getMouseXY(e),
                mouseX  = mouseXY[0],
                mouseY  = mouseXY[1];
    
            // Should redraw the poly but not stroke or fill it and then use isPointInPath() to test it
            // DON'T USE PATH OBJECT HERE
            
            // Need to save these so that they can be reset
            var old_strokestyle = co.strokeStyle,
                old_fillstyle   = co.fillStyle;
            
            co.beginPath();
                co.strokeStyle = 'rgba(0,0,0,0)';
                co.fillStyle = 'rgba(0,0,0,0)';
            this.drawPoly();
            
            // Reset the colors
            co.strokeStyle = old_strokestyle;
            co.fillStyle   = old_fillstyle;

    
            if (co.isPointInPath(mouseX, mouseY)) {
                    
                return {
                    0: this, 1: this.coords, 2: 0,
                    'object': this, 'coords': this.coords, 'index': 0, 'tooltip': prop['chart.tooltips'] ? prop['chart.tooltips'][0] : null
                };
            }
            
            return null;
        };




        /**
        * Each object type has its own Highlight() function which highlights the appropriate shape
        * 
        * @param object shape The shape to highlight
        */
        this.highlight =
        this.Highlight = function (shape)
        {
            // Evidentally this is necessary
            co.fillStyle = prop['chart.fillstyle'];

            // Add the new highlight
            if (prop['chart.tooltips.highlight']) {
                if (typeof prop['chart.highlight.style'] === 'function') {
                    (prop['chart.highlight.style'])(shape);
                } else {
                    pa2(co, ['b', 'fu', function (obj){obj.drawPoly();},'f',prop['chart.highlight.fill'],'s',prop['chart.highlight.stroke']]);
                }
            }
        };




        /**
        * This allows for easy specification of gradients
        */
        this.parseColors = function ()
        {

            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors['chart.fillstyle']        = RG.array_clone(prop['chart.fillstyle']);
                this.original_colors['chart.strokestyle']      = RG.array_clone(prop['chart.strokestyle']);
                this.original_colors['chart.highlight.stroke'] = RG.array_clone(prop['chart.highlight.stroke']);
                this.original_colors['chart.highlight.fill']   = RG.array_clone(prop['chart.highlight.fill']);
            }

            var func = this.parseSingleColorForGradient;
    
            /**
            * Parse various properties for colors
            */
            prop['chart.fillstyle']        = func(prop['chart.fillstyle']);
            prop['chart.strokestyle']      = func(prop['chart.strokestyle']);
            prop['chart.highlight.stroke'] = func(prop['chart.highlight.stroke']);
            prop['chart.highlight.fill']   = func(prop['chart.highlight.fill']);
        };




        /**
        * Use this function to reset the object to the post-constructor state. Eg reset colors if
        * need be etc
        */
        this.reset = function ()
        {
        };




        /**
        * This parses a single color value
        */
        this.parseSingleColorForGradient = function (color)
        {
            if (!color) {
                return color;
            }
    
            if (typeof color === 'string' && color.match(/^gradient\((.*)\)$/i)) {
    
                // Create the gradient
                var parts = RegExp.$1.split(':'),
                    grad  = co.createLinearGradient(0,0,ca.width,0),
                    diff  = 1 / (parts.length - 1);
    
                grad.addColorStop(0, RG.trim(parts[0]));
    
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RG.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };




        /**
        * Using a function to add events makes it easier to facilitate method chaining
        * 
        * @param string   type The type of even to add
        * @param function func 
        */
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            if (typeof this[type] !== 'function') {
                this[type] = func;
            } else {
                RG.addCustomEventListener(this, type, func);
            }
    
            return this;
        };




        /**
        * This function runs once only
        * (put at the end of the file (before any effects))
        */
        this.firstDrawFunc = function ()
        {
        };




        /**
        * Objects are now always registered so that the chart is redrawn if need be.
        */
        RG.register(this);




        /**
        * This is the 'end' of the constructor so if the first argument
        * contains configuration data - handle that.
        */
        if (parseConfObjectForOptions) {
            RG.parseObjectStyleConfig(this, conf.options);
        }
    };