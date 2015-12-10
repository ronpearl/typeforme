(function($, window, document, undefined) {

    var pluginName = 'typeForMe';

    function Plugin(element, options) {

        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set the instance options extending the plugin defaults and
        // the options passed by the user
        this.options = $.extend({}, $.fn[pluginName].defaults, options);

        // Holds blinking interval for cursor
        this.blinkingCursor;

        // Will hold timeout for typing and backspace actions
        this.typingAction;
        this.backspaceAction;

        // Set variables for calculating the current string and position position.
        // This will be for capabilities to start and stop functionality
        this.currentStringBeingTyped = "";
        this.currentPositionOfTyping = 0;
        // Current array position
        this.arrayPos = 0;

        // Keep track of current loop
        this.currentLoop = 0;

        // Initialize the plugin instance
        this.init();
    }


    Plugin.prototype = {

        init: function() {
            var theElement = this.$el;
            var thisSelf = this;
            if (theElement.text() != "") theElement.html("");

            // Check cursor settings, build if needed
            if (this.options.cursor.showCursor) {
                theElement.after('<span class="' + this.options.cursor.className + '">' + this.options.cursor.character + '</span>');
                this.startCursorBlink();
            }

            // See if user is using a stringsElement from the screen
            // If so, replace the default with the div items
            var whatToTypeArray = this.options.whatToType;

            if (this.options.stringsElement.element) {
                var enteredStringsElem = $(this.options.stringsElement.element);
                whatToTypeArray = [];
                whatToTypeArray = enteredStringsElem.text().split( this.options.stringsElement.delimiter );
            }

            // Shuffle strings array if needed
            this.options.whatToType = this.options.shuffle ? shuffleArray(whatToTypeArray) : whatToTypeArray;
            whatToTypeArray = this.options.whatToType;

            this.beginTypeProcess(whatToTypeArray);
        },

        beginTypeProcess: function(whatToTypeArray) {
            var thisSelf = this;
            var whatToTypeArrayUsed;

            if (whatToTypeArray) {
                whatToTypeArrayUsed = whatToTypeArray;
            } else {
                whatToTypeArrayUsed = this.options.whatToType;
                this.stopTyping();
            }

            // Start delay based on user input
            setTimeout( function() {
                // Do first typing
                thisSelf.startTyping(whatToTypeArrayUsed[0], 0);
            }, this.options.startDelay);
        },

        startTyping: function(currentString, currentPosition) {
            var theElement = this.$el;
            var thisSelf = this;

            // Set variables for recording where we are currently
            this.currentStringBeingTyped = currentString;
            this.currentPositionOfTyping = currentPosition;

            // Humanize typing delay
            typeDelay = Math.round(Math.random() * (100 - 30) + thisSelf.options.typeSpeed);

            // Make sure the typingAction timeout wasn't cleared yet
            // otherwise do typing
            this.typingAction = setTimeout(function () {
                thisSelf.continueTyping();
            }, typeDelay);
        },

        continueTyping: function() {
            if (this.typingAction == undefined || this.typingAction != false) {
                var theElement = this.$el;
                var thisSelf = this;
                var currentString = this.currentStringBeingTyped;
                var currentPosition = this.currentPositionOfTyping;

                // Skip over html characters
                if (self.contentType === 'html') {
                    var curChar = currentString.substr(currentPosition).charAt(0)
                    if (curChar === '<' || curChar === '&') {
                        var tag = '';
                        var endTag = '';
                        if (curChar === '<') {
                            endTag = '>'
                        } else {
                            endTag = ';'
                        }
                        while (currentString.substr(currentPosition).charAt(0) !== endTag) {
                            tag += currentString.substr(currentPosition).charAt(0);
                            currentPosition++;
                        }
                        currentPosition++;
                        tag += endTag;
                    }
                }

                if (currentPosition === currentString.length) {
                    // fires callback function
                    thisSelf.options.onStringTyped(thisSelf.arrayPos);

                    // is this the final string
                    if (thisSelf.arrayPos === thisSelf.options.whatToType.length - 1) {
                        // animation that occurs on the last typed string
                        thisSelf.options.callback();

                        thisSelf.currentLoop++;

                        // quit if we wont loop back
                        if (thisSelf.options.loop === false || thisSelf.currentLoop === thisSelf.options.loopCount)
                            return;
                    }

                    thisSelf.timeout = setTimeout(function () {
                        thisSelf._backspacing(currentString, currentPosition);
                    }, thisSelf.backDelay);
                } else {
                    // If this is the first item of the string typed,
                    // do preStringTyped function if declared by user
                    if (currentPosition == 0) thisSelf.options.preStringTyped();

                    // Start the string adding
                    var nextString = currentString.substr(0, currentPosition + 1);
                    if (thisSelf.options.attr) {
                        theElement.attr(thisSelf.options.attr, nextString);
                    } else {
                        if (thisSelf.isInput) {
                            theElement.val(nextString);
                        } else if (thisSelf.options.contentType === 'html') {
                            theElement.html(nextString);
                        } else {
                            theElement.text(nextString);
                        }
                    }

                    // add characters one by one
                    currentPosition++;
                    // Loop it
                    this.startTyping(currentString, currentPosition);
                }
            } else {
                this.beginTypeProcess(this.options.whatToType);
            }
        },

        stopTyping: function() {
            var theElement = this.$el;
            var thisSelf = this;

            clearTimeout(this.typingAction);
            clearTimeout(this.backspaceAction);
            this.typingAction = false;
            this.backspaceAction = false;

            if (thisSelf.options.attr) {
                theElement.attr(thisSelf.options.attr, '');
            } else {
                if (thisSelf.isInput) {
                    theElement.val('');
                } else if (thisSelf.options.contentType === 'html') {
                    theElement.html('');
                } else {
                    theElement.text('');
                }
            }
        },

        _backspacing: function(currentString, currentPosition) {
            var theElement = this.$el;
            var thisSelf = this;

            // Humanize typing delay
            typeDelay = Math.round(Math.random() * (100 - 30) + thisSelf.options.typeSpeed);

            this.backspaceAction = setTimeout( function() {
                var nextString = currentString.substr(0, currentPosition);
                if (thisSelf.options.attr) {
                    theElement.attr(thisSelf.options.attr, nextString);
                } else {
                    if (thisSelf.isInput) {
                        theElement.val(nextString);
                    } else if (thisSelf.options.contentType === 'html') {
                        theElement.html(nextString);
                    } else {
                        theElement.text(nextString);
                    }
                }

                // if the number (id of character in current string) is
                // less than 0, keep going
                if (currentPosition > 0) {
                    // subtract characters one by one
                    currentPosition--;
                    // loop the function
                    thisSelf._backspacing(currentString, currentPosition);
                }
                // if the stop number has been reached, increase
                // array position to next string
                else if (currentPosition <= 0) {
                    thisSelf.arrayPos++;

                    if (thisSelf.arrayPos === thisSelf.options.whatToType.length) {
                        thisSelf.arrayPos = 0;

                        // Shuffle strings array if needed
                        //thisSelf.options.whatToType = thisSelf.options.shuffle ? shuffleArray(thisSelf.options.whatToType) : thisSelf.options.whatToType;

                        thisSelf.beginTypeProcess(thisSelf.options.whatToType);
                    } else {
                        thisSelf.startTyping(thisSelf.options.whatToType[thisSelf.arrayPos], currentPosition);
                    }
                }
            }, typeDelay);
        },

        startCursorBlink: function() {
            if (!this.blinkingCursor) {
                var theElemToBlink = $('.' + this.options.cursor.className);

                this.blinkingCursor = setInterval(function () {
                    theElemToBlink.fadeToggle("fast");
                }, this.options.cursor.blinkInterval);
            }
        },

        stopCursorBlink: function() {
            clearInterval(this.blinkingCursor);
            this.blinkingCursor = false;
        },

        destroy: function() {

            // Remove any attached data from your plugin
            this.$el.removeData();
        }
    };


    /* * * * * * * * * * * * * *
     *   Shuffles a passed array
     * * * * * * * * * * * * * * */
    var shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };


    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each
            // selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };


    $.fn[pluginName].defaults = {
        whatToType: ["String Options 1", "Another String", "Third times a charm"],
        shuffle: false,         // shuffle the strings
        stringsElement: {
            element: null,          // if pulling words from an element on screen
            delimiter: ","      // delimiter to check for strings
        },
        typeSpeed: 70,           // Speed of typing
        startDelay: 0,          // Delay at start
        backSpeed: 0,           // Backspacing speed
        backDelay: 500,         // time before backspacing
        loop: false,            // Keep looping text?
        loopCount: false,       // false = infinite
        cursor: {               // Cursor character
            showCursor: true,   // Show blinking cursor
            character: "|",
            className: "typeformeCursor",
            blinkInterval: 550
        },
        attr: null,             // attribute to type (null == text)
        contentType: 'html',    // either html or text
        callback: function() {},        // call when done callback function
        preStringTyped: function() {},  // starting callback function before each string
        onStringTyped: function() {}   // callback for every typed string
    };

})(jQuery, window, document);
