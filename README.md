# irc message parser
[![Build Status](https://travis-ci.org/Bonuspunkt/ircmessageparser.svg?branch=master)](https://travis-ci.org/Bonuspunkt/ircmessageparser)
[![codecov.io](https://img.shields.io/codecov/c/github/Bonuspunkt/ircmessageparser.svg?branch=master)](https://codecov.io/gh/Bonuspunkt/ircmessageparser?branch=master)
[![npm](https://img.shields.io/npm/v/ircmessageparser.svg)](https://www.npmjs.com/package/ircmessageparser)
[![license](https://img.shields.io/npm/l/ircmessageparser.svg)](https://tldrlegal.com/license/-isc-license)

extracts styling information, urls and channels from a string.

## how to install
```
npm install ircmessageparser --save
```

## api
``` js
const parser = require('ircmessageparser');
```

### parse(text[, settings])
this will extract the styling, urls, and channels

- `text`
- `settings`
    - `stripControlCodes` strip control chars (`0x00`-`0x1F`)
    - `channelPrefixes` should be an array with RPL_ISUPPORT.CHANTYPES (ex. `['#', '&']`) defaults to `['#']`
    - `userModes` userModes should be an array with RPL_ISUPPORT.PREFIX (ex: `['!', '+']`) defaults to `['@', '+']`

``` js
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

## notes
if you prefer a different algorithm for link / channel detection take a look at `lib/parse`
