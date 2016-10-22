const expect = require('chai').expect;
const parse = require('../lib/parse');

describe('parse', () => {
    it('should work with urls', () => {
        const input = '\x02irc\x0f://\x1dfreenode.net\x0f/\x034,8thelounge';
        const expected = [{
            link: 'irc://freenode.net/thelounge',
            start: 0,
            end: 28,
            fragments: [{
                bold: true,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: 'irc',
                start: 0,
                end: 3
            }, {
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '://',
                start: 3,
                end: 6
            }, {
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: true,
                underline: false,
                text: 'freenode.net',
                start: 6,
                end: 18
            }, {
                bold: false,
                textColor: undefined,
                bgColor: undefined,
                reverse: false,
                italic: false,
                underline: false,
                text: '/',
                start: 18,
                end: 19
            }, {
                bold: false,
                textColor: 4,
                bgColor: 8,
                reverse: false,
                italic: false,
                underline: false,
                text: 'thelounge',
                start: 19,
                end: 28
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
