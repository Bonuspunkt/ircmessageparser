const expect = require('chai').expect;
const parse = require('../lib/parse');

describe('parse', () => {
    it('should work with urls', () => {
        const input = '\x02 irc\x0f://\x1dfreenode.net\x0f/\x034,8nodejs ';
        const expected = [{
            start: 0,
            end: 1,
            fragments: [{
                bold: true,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: ' ',
                start: 0,
                end: 1
            }]
        }, {
            link: 'irc://freenode.net/nodejs',
            start: 1,
            end: 26,
            fragments: [{
                bold: true,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: 'irc',
                start: 1,
                end: 4
            }, {
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '://',
                start: 4,
                end: 7
            }, {
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: true,
                underline: false,
                text: 'freenode.net',
                start: 7,
                end: 19
            }, {
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '/',
                start: 19,
                end: 20
            }, {
                bold: false,
                textColor: 4,
                bgColor: 8,
                reverse: false,
                italic: false,
                underline: false,
                text: 'nodejs',
                start: 20,
                end: 26
            }]
        }, {
            start: 26,
            end: 27,
            fragments: [{
                bold: false,
                textColor: 4,
                bgColor: 8,
                reverse: false,
                italic: false,
                underline: false,
                text: ' ',
                start: 26,
                end: 27
            }]
        }];

        const actual = parse(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should work with channels', () => {
        const input = '\x02#\x038,9thelounge';
        const expected = [{
            channel: '#thelounge',
            start: 0,
            end: 10,
            fragments: [{
                bold: true,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '#',
                start: 0,
                end: 1
            }, {
                bold: true,
                textColor: 8,
                bgColor: 9,
                reverse: false,
                italic: false,
                underline: false,
                text: 'thelounge',
                start: 1,
                end: 10
            }]
        }];

        const actual = parse(input);

        expect(actual).to.deep.equal(expected);
    });
});
