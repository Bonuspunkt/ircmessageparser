# irc message parser [![Build Status](https://travis-ci.org/Bonuspunkt/ircmessageparser.svg?branch=master)](https://travis-ci.org/Bonuspunkt/ircmessageparser)

extracts styling information, urls and channels from a string.

## how to install
```
npm install ircmessageparser --save
```

## how to use
``` js
const parser = require('ircmessageparser');

// this will only extract style information
const parsedStyle = parser.parseStyle('\x034#Test');
console.log(parsed);
/*
output: [{
    bold: false,
    textColor: 4,
    bgColor: undefined,
    reverse: false,
    italic: false,
    underline: false,
    text: '#Test',
}]
*/

// this will extract urls and channels
const analysedText = parser.analyseText('#Test www.google.com http://test.org');
/*
output: [{
    start: 0,
    end: 5,
    channel: '#Test'
}, {
    start: 5,
    end: 6
}, {
    start: 6,
    end: 20,
    link: 'http://www.google.com'
}, {
    start: 20,
    end: 21
}, {
    start: 21,
    end: 36,
    link: 'http://test.org'
}]
*/

// this will extract the styling, urls, and channels
const parsed = parser.parse('\x034#Test');
console.log(parsed);
/*
output: [{
    channel: '#Test',
    start: 0,
    end: 5,
    fragments: [{
        bold: false,
        textColor: 4,
        bgColor: undefined,
        reverse: false,
        italic: false,
        underline: false,
        text: '#Test',
        start: 0,
        end: 5,
     }]
}]
*/
```
