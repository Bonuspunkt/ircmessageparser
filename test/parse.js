const expect = require('chai').expect;
const parse = require('../lib/parse');
const anyIntersection = require('../lib/anyIntersection');

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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
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
                hexTextColor: undefined,
                hexBgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '#',
                start: 0,
                end: 1
            }, {
                bold: true,
                textColor: 8,
                hexTextColor: undefined,
                hexBgColor: undefined,
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

    it('should optimize', () => {
        const input = 'test \x0312#\x0312\x0312"te\x0312st\x0312\x0312\x0312\x0312\x0312\x0312a';
        const expected = [{
            start: 0,
            end: 5,
            fragments: [{
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                hexTextColor: undefined,
                hexBgColor: undefined,
                reverse: false,
                italic: false,
                text: 'test ',
                underline: false,

                start: 0,
                end: 5,
            }]
        }, {
            channel: '#"testa',
            start: 5,
            end: 12,
            fragments: [{
                bold: false,
                textColor: 12,
                hexTextColor: undefined,
                hexBgColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '#"testa',

                start: 5,
                end: 12,
            }]
        }];

        const actual = parse(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should not overlap parts', () => {
        const input = 'Url: http://example.com/path Channel: ##channel';
        const actual = parse(input);

        const hasIntersection = actual.some(a => actual.some(b => a !== b && anyIntersection(a, b)));
        expect(hasIntersection).to.equal(false);
    });

    it('should handle overlapping parts by using first starting', () => {
        const input = '#test-https://google.com';
        const expected = [{
            channel: '#test-https://google.com',
            start: 0,
            end: 24,
            fragments: [{
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                hexTextColor: undefined,
                hexBgColor: undefined,
                reverse: false,
                italic: false,
                text: '#test-https://google.com',
                underline: false,

                start: 0,
                end: 24,
            }]
        }];
        const actual = parse(input);

        expect(actual).to.deep.equal(expected);
    });

});
