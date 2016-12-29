const findChannels = require('./findChannels');
const findLinks = require('./findLinks');
const parseStyle = require('./parseStyle');
const merge = require('./merge');

function parse(text, settings = {}) {
    const { stripControlCodes, channelPrefixes, userModes } = settings;

    const fragments = parseStyle(text, stripControlCodes);

    const cleanText = fragments.map(fragment => fragment.text).join('');

    const channelParts = findChannels(cleanText, channelPrefixes, userModes);
    const linkParts = findLinks(cleanText);

    const parts = channelParts.concat(linkParts);

    return merge(parts, fragments);
}

module.exports = parse;
