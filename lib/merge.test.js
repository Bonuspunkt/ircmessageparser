const { describe, expect, test } = require('@jest/globals');

const merge = require('../lib/merge');

describe('merge', () => {
    test('should split style information', () => {
        const textParts = [{
            start: 0,
            end: 10,
            flag1: true
        }, {
            start: 10,
            end: 20,
            flag2: true
        }];
        const styleFragments = [{
            start: 0,
            end: 5,
            text: '01234'
        }, {
            start: 5,
            end: 15,
            text: '5678901234'
        }, {
            start: 15,
            end: 20,
            text: '56789'
        }];

        const expected = [{
            start: 0,
            end: 10,
            flag1: true,
            fragments: [{
                start: 0,
                end: 5,
                text: '01234'
            }, {
                start: 5,
                end: 10,
                text: '56789'
            }]
        }, {
            start: 10,
            end: 20,
            flag2: true,
            fragments: [{
                start: 10,
                end: 15,
                text: '01234'
            }, {
                start: 15,
                end: 20,
                text: '56789'
            }]
        }];

        const actual = merge(textParts, styleFragments);

        expect(actual).toEqual(expected);
    });
});
