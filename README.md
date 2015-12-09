## Synopsis
JQuery Plugin that allows does auto-typing of text onto the page - sampled from Typed.js

## Motivation
This was a quick spin-off of https://github.com/mattboldt/typed.js/.   The author did a great job with it but there were some minor functionalities that were missing.  I decided to take some of his ([mattboldt](https://github.com/mattboldt)) wonderful work and port it into something a little more fluid that allows for more customizability. 

Some things I was looking to add were the capabilities to start/stop the typing actions, more customization for the cursor, pulling of strings from the page, etc...

Keep in mind that this wasn't straight copied from his work and there were a number of things I left out because I wanted to strip it down.  Maybe in the future I'll add some of those other functionalities in, but for now it is what it is.

## Code Example
    $( "#divToPutText" ).typeForMe({
        whatToType: ["String Options 1", "Another String", "Third times a charm"],
        shuffle: true
        ...
    });

or to call a predefined function:

    $( "#divToPutText" ).typeForMe('stopTyping');
    
Here are the available predefined functions:

    'beginTypeProcess'      // Deletes and re-starts the typing
    'stopTyping'            // Stops the typing
    'startCursorBlink'      // Re-starts the cursor blink
    'stopCursorBlink'       // Stops the cursor blink

## Installation
Add the typeforme.js file and a reference to JQuery. Then you can instantiate the plugin like so:

    $( "#divToPutText" ).typeForMe();

## Usage
You can access a number of the defaults when creating the plugin instance. Here are the defaults:

    $( "#divToPutText" ).typeForMe({
        whatToType: ["String Options 1", "Another String", "Third times a charm"],
        shuffle: false,                   // shuffle the strings
        stringsElement: {                 // if pulling words from an element on screen
            element: null,                // Element to pull from ('.class', '#div', etc...)
            delimiter: ","                // delimiter to check for strings within the above element
        },
        typeSpeed: 70,                    // Speed of typing
        startDelay: 0,                    // Delay at start
        backSpeed: 0,                     // Backspacing speed
        backDelay: 500,                   // time before backspacing
        loop: false,                      // Keep looping text?
        loopCount: false,                 // false = infinite
        cursor: {                         // Cursor character
            showCursor: true,             // Show blinking cursor
            character: "|",
            className: "typeformeCursor",
            blinkInterval: 550
        },
        attr: null,                       // attribute to type (null == text)
        contentType: 'html',              // either html or text
        callback: function() {},          // call when done callback function
        preStringTyped: function() {},    // starting callback function before each string
        onStringTyped: function() {}      // callback for every typed string
    });

## Support

I'm not 100% always watching my projects so please be patient if you submit any questions/comments.  By all means I am always open to fixing any issues as well as answering some questions so feel free to blast away!

## Contributors
http://ronaldpearl.com
