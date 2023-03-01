const { describe, expect, test } = require('@jest/globals');
const anyIntersection = require('./anyIntersection');

describe('anyIntersection', () => {

    test('should not intersect on edges', () => {
        const a = { start: 1, end: 2 };
        const b = { start: 2, end: 3 };

        expect(anyIntersection(a, b)).toBe(false);
        expect(anyIntersection(b, a)).toBe(false);
    });

    test('should intersect on overlapping', () => {
        const a = { start: 0, end: 3 };
        const b = { start: 1, end: 2 };

        expect(anyIntersection(a, b)).toBe(true);
        expect(anyIntersection(b, a)).toBe(true);
    });

    test('should not intersect', () => {
        const a = { start: 0, end: 1 };
        const b = { start: 2, end: 3 };

        expect(anyIntersection(a, b)).toBe(false);
        expect(anyIntersection(b, a)).toBe(false);
    });

});
