const expect = require('chai').expect;
const parseStyle = require('../lib/parseStyle');

describe('parseStyle', () => {

    it('should skip control codes', () => {
        const input = 'text\x01with\x04control\x05codes';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'textwithcontrolcodes'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should not skip control codes when parameter `stripControlCodes` is set to false', () => {
        const input = 'text\x01with\x04control\x05codes';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'text\x01with\x04control\x05codes'
        }];

        const actual = parseStyle(input, false);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse bold', () => {
        const input = '\x02bold';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse textColor', () => {
        const input = '\x038yellowText';
        const expected = [{
            bold: false,
            textColor: 8,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellowText'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse textColor and background', () => {
        const input = '\x034,8yellowBG redText';
        const expected = [{
            textColor: 4,
            bgColor: 8,
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellowBG redText'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse italic', () => {
        const input = '\x1ditalic';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: true,
            underline: false,
            text: 'italic'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should carry state corretly forward', () => {
        const input = '\x02bold\x038yellow\x02nonBold\x03default';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold'
        }, {
            bold: true,
            textColor: 8,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellow'
        }, {
            bold: false,
            textColor: 8,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'nonBold'
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'default'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should toggle bold correctly', () => {
        const input = '\x02bold\x02 \x02bold\x02';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold'
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: ' '
        }, {
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('reset should reset all styles', () => {
        const input = '\x02\x034\x16\x1d\x1ffull\x0fnone';
        const expected = [{
            bold: true,
            textColor: 4,
            bgColor: undefined,
            reverse: true,
            italic: true,
            underline: true,
            text: 'full'
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'none'
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

});
