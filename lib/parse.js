const anyIntersection = require('./anyIntersection');
const fill = require('./fill');
const findChannels = require('./findChannels');
const findLinks = require('./findLinks');
const parseStyle = require('./parseStyle');

function parse(text, channelPrefixes) {
    const fragments = parseStyle(text).map((fragment, i, array) => {
        fragment.start = i === 0 ? 0 : array[i - 1].end;
        fragment.end = fragment.start + fragment.text.length;
        return fragment;
    });

    const cleanText = fragments.map(fragment => fragment.text).join('');

    const channelParts = findChannels(cleanText, channelPrefixes);
    const linkParts = findLinks(cleanText);

    const parts = channelParts.concat(linkParts);
    const textParts = parts.concat(fill(parts, cleanText))
        .sort((a, b) => a.start - b.start);

    return textParts.map(textPart => {
        textPart.fragments = fragments
            .filter(fragment => anyIntersection(textPart, fragment))
            .map(fragment => {
                const fragStart = fragment.start;
                const start = Math.max(fragment.start, textPart.start);
                const end = Math.min(fragment.end, textPart.end);

                return Object.assign({}, fragment, {
                    start: start,
                    end: end,
                    text: fragment.text.slice(start - fragStart, end - fragStart)
                });
            });
        return textPart;
    });
}

module.exports = parse;
