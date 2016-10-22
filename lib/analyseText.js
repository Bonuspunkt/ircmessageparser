const punctuations = ['\'', '\"', '.', ',', '!', '?', '¿', '<', '>', ':'];

// scheme -> https://tools.ietf.org/html/rfc3986#section-3.1
const schemePattern = /[a-z][a-z0-9+-.]*$/i;

function analyseText(text, channelPrefixes = ['#']) {
    const result = [];
    let position = 0;
    let start, end;
    while (position < text.length) {

        if (text[position] === ':' &&
            text[position + 1] === '/' &&
            text[position + 2] === '/') {
            start = position;
            const match = schemePattern.exec(text.slice(0, start));
            if (match) {
                start = match.index;
            }
            end = position + 2;
            while (end < text.length && /\S/.test(text[end])) {
                end += 1;
            }
            if (match && end !== position + 2) {
                while (punctuations.indexOf(text[end - 1]) !== -1) {
                    end -= 1;
                }
                result.push({
                    start: start,
                    end: end,
                    link: text.slice(start, end)
                });
                position = end;
            }
        } else if (text[position] === 'w' &&
            text[position + 1] === 'w' &&
            text[position + 2] === 'w' &&
            text[position + 3] === '.') {
            start = position;
            while (start > -1 && /\S/.test(text[start])) {
                start -= 1;
            }
            start += 1;

            end = position + 4;
            while (end < text.length && /\S/.test(text[end])) {
                end += 1;
            }

            if (end > position + 4) {
                while (punctuations.indexOf(text[start]) !== -1) {
                    start += 1;
                }
                while (punctuations.indexOf(text[end - 1]) !== -1) {
                    end -= 1;
                }

                result.push({
                    start: start,
                    end: end,
                    link: 'http://' + text.slice(start, end)
                });
            }
        } else if (channelPrefixes.indexOf(text[position]) !== -1 &&
            (position === 0 || /[^0-9a-z]/i.test(text[position - 1]))) {
            start = position;
            end = position + 1;
            while (end < text.length && /[^ \u0007]/.test(text[end])) {
                end += 1;
            }

            if (end - start > 1) {
                result.push({
                    start: start,
                    end: end,
                    channel: text.slice(start, end)
                });
            }
        }
        position += 1;
    }

	// fill
    position = 0;
    for (let i = 0; i < result.length; i++) {
        const textSegment = result[i];
        if (textSegment.start > position) {
            result.splice(i, 0, {
                start: position,
                end: textSegment.start
            });
        }
        position = textSegment.end;
    }
    if (position < text.length) {
        result.push({
            start: position,
            end: text.length
        });
    }

    return result;
}

module.exports = analyseText;
