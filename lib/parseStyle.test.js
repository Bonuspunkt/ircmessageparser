const { describe, expect, test } = require('@jest/globals');
const parseStyle = require('../lib/parseStyle');

describe('parseStyle', () => {

    test('should skip control codes', () => {
        const input = 'text\x01with\x05control\x06codes';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'textwithcontrolcodes',

            start: 0,
            end: 20
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should not skip control codes when parameter `stripControlCodes` is set to false', () => {
        const input = 'text\x01with\x05control\x06codes';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'text\x01with\x05control\x06codes',

            start: 0,
            end: 23
        }];

        const actual = parseStyle(input, false);

        expect(actual).toEqual(expected);
    });

    test('should parse bold', () => {
        const input = '\x02bold';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 0,
            end: 4
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should parse textColor', () => {
        const input = '\x038yellowText';
        const expected = [{
            bold: false,
            textColor: 8,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellowText',

            start: 0,
            end: 10
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should parse textColor and background', () => {
        const input = '\x034,8yellowBG redText';
        const expected = [{
            textColor: 4,
            bgColor: 8,
            hexTextColor: undefined,
            hexBgColor: undefined,
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellowBG redText',

            start: 0,
            end: 16
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should keep bg color when only text color is set', () => {
        const input = '\x031,2 text \x033 newColor';
        const expected = [{
            textColor: 1,
            bgColor: 2,
            hexTextColor: undefined,
            hexBgColor: undefined,
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: ' text ',

            start: 0,
            end: 6
        }, {
            textColor: 3,
            bgColor: 2,
            hexTextColor: undefined,
            hexBgColor: undefined,
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: ' newColor',

            start: 6,
            end: 15
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should parse italic', () => {
        const input = '\x1ditalic';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: true,
            underline: false,
            text: 'italic',

            start: 0,
            end: 6
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should carry state corretly forward', () => {
        const input = '\x02bold\x038yellow\x02nonBold\x03default';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 0,
            end: 4
        }, {
            bold: true,
            textColor: 8,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellow',

            start: 4,
            end: 10
        }, {
            bold: false,
            textColor: 8,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'nonBold',

            start: 10,
            end: 17
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'default',

            start: 17,
            end: 24
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should toggle bold correctly', () => {
        const input = '\x02bold\x02 \x02bold\x02';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 0,
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
            text: ' ',

            start: 4,
            end: 5
        }, {
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 5,
            end: 9
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should reset all styles', () => {
        const input = '\x02\x034\x04012345,6789AB\x16\x1d\x1ffull\x0fnone';
        const expected = [{
            bold: true,
            textColor: 4,
            bgColor: undefined,
            hexTextColor: '012345',
            hexBgColor: '6789AB',
            reverse: true,
            italic: true,
            underline: true,
            text: 'full',

            start: 0,
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
            text: 'none',

            start: 4,
            end: 8
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should not emit empty fragments', () => {
        const input = '\x031\x031,2\x031\x031,2\x031\x031,2\x03a';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'a',

            start: 0,
            end: 1
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should optimize fragments', () => {
        const rawString = 'oh hi test text';
        const colorCode = '\x0312';
        const input = colorCode + rawString.split('').join(colorCode);
        const expected = [{
            bold: false,
            textColor: 12,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: rawString,

            start: 0,
            end: rawString.length
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

    test('should parse hex textColor and background', () => {
        const input = '\x04C0FFEE,BAD5ADtext\x04reset';
        const expected = [{
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: 'C0FFEE',
            hexBgColor: 'BAD5AD',
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: 'text',

            start: 0,
            end: 4
        }, {
            textColor: undefined,
            bgColor: undefined,
            hexTextColor: undefined,
            hexBgColor: undefined,
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: 'reset',

            start: 4,
            end: 9
        }];

        const actual = parseStyle(input);

        expect(actual).toEqual(expected);
    });

});
