const parseStyle = require('./parseStyle');
const analyseText = require('./analyseText');

function anyIntersection(a, b) {
    return a.start <= b.start && b.start <= a.end ||
        a.start <= b.end && b.end <= a.end ||
        b.start <= a.start && a.start <= b.end ||
        b.start <= a.end && a.end <= b.end;
}

function fullProcess(text) {
    const fragments = parseStyle(text).map((fragment, i, array) => {
        fragment.start = i === 0 ? 0 : array[i - 1].end;
        fragment.end = fragment.start + fragment.text.length;
        return fragment;
    });

    const cleanText = fragments.map(fragment => fragment.text).join('');

    const textParts = analyseText(cleanText);

    return textParts.map(textPart => {
        textPart.fragments = fragments
            .filter(fragment => anyIntersection(textPart, fragment))
            .map(fragment => {
                const start = Math.max(fragment.start, textPart.start);
                const end = Math.min(fragment.end, textPart.end);
                return Object.assign({}, fragment, {
                    start: start,
                    end: end,
                    text: fragment.text.slice(start - fragment.start, end - fragment.start)
                });
            });
        return textPart;
    });
}

module.exports = fullProcess;
