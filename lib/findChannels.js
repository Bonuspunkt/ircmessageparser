const escapeStringRegexp = require('escape-string-regexp');

// NOTE: channel prefixes should be RPL_ISUPPORT.CHANTYPES
// NOTE: userModes should be RPL_ISUPPORT.PREFIX
function findChannels(text, channelPrefixes = ['#'], userModes = ['@', '+']) {

    const userModePattern = userModes.map(prefix => `${ escapeStringRegexp(prefix) }?`).join('');
    const channelPrefixPattern = channelPrefixes.map(escapeStringRegexp).join('');

    const channelPattern = `(?:^|\\s)${ userModePattern }([${ channelPrefixPattern }][^ \u0007]+)`;
    const channelRegExp = new RegExp(channelPattern, 'g');

    const result = [];
    let match;

    do {
        match = channelRegExp.exec(text);

        if (match) {
            const [wholeMatch, channel] = match;
            const offset = wholeMatch.length - channel.length;
            result.push({
                start: match.index + offset,
                end: match.index + wholeMatch.length,
                channel: match[1]
            });
        }
    } while (match);

    return result;
}

module.exports = findChannels;
