const { describe, expect, test } = require('@jest/globals');
const findChannels = require('../lib/findChannels');


describe('findChannels', () => {

    test('should find single letter channel', () => {
        const input = '#a';
        const expected = [{
            channel: '#a',
            start: 0,
            end: 2
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should find utf8 channels', () => {
        const input = '#äöü';
        const expected = [{
            channel: '#äöü',
            start: 0,
            end: 4
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should find inline channel', () => {
        const input = 'inline #channel text';
        const expected = [{
            channel: '#channel',
            start: 7,
            end: 15
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should stop at \\0x07', () => {
        const input = '#chan\x07nel';
        const expected = [{
            channel: '#chan',
            start: 0,
            end: 5
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should allow classics pranks', () => {
        const input = '#1,000';
        const expected = [{
            channel: '#1,000',
            start: 0,
            end: 6
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should work with whois reponses', () => {
        const input = '@#a';
        const expected = [{
            channel: '#a',
            start: 1,
            end: 3
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should work with IRCv3.1 multi-prefix', () => {
        const input = '!@%+#a';
        const expected = [{
            channel: '#a',
            start: 4,
            end: 6
        }];

        const actual = findChannels(input, ['#'], ['!', '@', '%', '+']);

        expect(actual).toEqual(expected);
    });

    test('should not match duplicte prefix', () => {
        const input = '@@#a';
        const expected = [];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });

    test('should work with custom channelPrefixes', () => {
        const input = '@a';
        const expected = [{
            channel: '@a',
            start: 0,
            end: 2
        }];

        const actual = findChannels(input, ['@']);

        expect(actual).toEqual(expected);
    });

    test('should handle multiple channelPrefix correctly', () => {
        const input = '##test';
        const expected = [{
            channel: '##test',
            start: 0,
            end: 6
        }];

        const actual = findChannels(input);

        expect(actual).toEqual(expected);
    });
});
