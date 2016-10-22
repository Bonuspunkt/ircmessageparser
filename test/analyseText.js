const expect = require('chai').expect;
const analyseText = require('../lib/analyseText');


describe('analyseText', () => {

    it('should find url', () => {
        const input = 'irc://freenode.net/thelounge';
        const expected = [{
            start: 0,
            end: 28,
            link: 'irc://freenode.net/thelounge',
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find urls with www', () => {
        const input = 'www.nooooooooooooooo.com';
        const expected = [{
            start: 0,
            end: 24,
            link: 'http://www.nooooooooooooooo.com'
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find urls in strings', () => {
        const input = 'look at https://thelounge.github.io/ for more information';
        const expected = [{
            start: 0,
            end: 8
        }, {
            link: 'https://thelounge.github.io/',
            start: 8,
            end: 36
        }, {
            start: 36,
            end: 57
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find urls in strings starting with www', () => {
        const input = 'use www.duckduckgo.com for privacy reasons';
        const expected = [{
            start: 0,
            end: 4
        }, {
            link: 'http://www.duckduckgo.com',
            start: 4,
            end: 22
        }, {
            start: 22,
            end: 42
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);

    });

    it('should find urls with odd surroundings', () => {
        const input = '<https://theos.kyriasis.com/~kyrias/stats/archlinux.html>';
        const expected = [{
            start: 0,
            end: 1
        }, {
            link: 'https://theos.kyriasis.com/~kyrias/stats/archlinux.html',
            start: 1,
            end: 56
        }, {
            start: 56,
            end: 57
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find urls with starting with www. and odd surroundings', () => {
        const input = '.:www.github.com:.';
        const expected = [{
            start: 0,
            end: 2
        }, {
            link: 'http://www.github.com',
            start: 2,
            end: 16
        }, {
            start: 16,
            end: 18
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });


    it('should not find urls', () => {
        const input = 'text www. text';
        const expected = [{
            start: 0,
            end: 14
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find single letter channel', () => {
        const input = '#a';
        const expected = [{
            channel: '#a',
            start: 0,
            end: 2
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find utf8 channels', () => {
        const input = '#äöü';
        const expected = [{
            channel: '#äöü',
            start: 0,
            end: 4
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should find inline channel', () => {
        const input = 'inline #channel text';
        const expected = [{
            start: 0,
            end: 7
        }, {
            channel: '#channel',
            start: 7,
            end: 15
        }, {
            start: 15,
            end: 20
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should stop at \\0x07', () => {
        const input = '#chan\x07nel';
        const expected = [{
            channel: '#chan',
            start: 0,
            end: 5
        }, {
            start: 5,
            end: 9
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should allow classics pranks', () => {
        const input = '#1,000';
        const expected = [{
            channel: '#1,000',
            start: 0,
            end: 6
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should work with whois reponses', () => {
        const input = '@#a';
        const expected = [{
            start: 0,
            end: 1
        }, {
            channel: '#a',
            start: 1,
            end: 3
        }];

        const actual = analyseText(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should work with custom channelPrefixes', () => {
        const input = '@a';
        const expected = [{
            channel: '@a',
            start: 0,
            end: 2
        }];

        const actual = analyseText(input, ['@']);

        expect(actual).to.deep.equal(expected);
    });

});
