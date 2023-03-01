const anyIntersection = require('../lib/anyIntersection');
const fill = require('../lib/fill');
const parseStyle = require('../lib/parseStyle');
const findChannels = require('../lib/findChannels');
const findLinks = require('../lib/findLinks');
const parse = require('../lib/parse');

const inputStrings = [
    '',
    '[\x0310longurl-example.com\x0f] \x0312some guy\x0f pushed \x0312\x021\x0f new commit to \x0306master\x0f: \x0302\x1fhttps://longurl-example.com/\x0f',
    'Welcome to #minecraft | Rules: https://minecraft.reddit.com/w/irc | Goodbye Nikondork | Stable [1.11] https://redd.it/5cw2tb | Snapshot [16w50a] https://redd.it/5ihzoq | Hail Santa! | Meetup survey: https://goo.gl/forms/lfZzgF4b4n2dmtAh1 | *christmas decorations here*',
    'Steam Linux User Group | Channel rules: https://steamlug.org/irc#coc | Not affiliated with Valve/Steam! Contact Steam Support for customer service. | Gaming Events: https://steamlug.org/events | Fortnightly Audiocast: https://steamlug.org/cast | Report Steam Bugs: https://github.com/ValveSoftware/steam-for-linux/issues'
];


const language = 'en-US';
const numberFormat = Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
function measure(name, array, fn) {

    name = (name + ' '.repeat(20)).slice(0, 20);

    const start = Date.now();
    const result = array.map(fn);
    const end = Date.now();

    const duration = (' '.repeat(6) + (end - start)).slice(-6);
    const op = (' '.repeat(6) + numberFormat.format(duration / result.length * 1000)).slice(-6);

    console.log(`  - ${name} ${duration}ms / ${op}µs/op`);

    return result;
}

function benchmark(inputString) {
    console.log(`"${inputString}"`);

    const input = Array.from(' '.repeat(1e4)).map(() => inputString);

    const fragments = measure('parseStyle', input, parseStyle);

    const rawStrings = measure('rawStrings', fragments, fragment => fragment.map(f => f.text).join(''));

    const findChannelResult = measure('findChannels', rawStrings, text => findChannels(text));

    const findLinkResult = measure('findLinks', rawStrings, text => findLinks(text));

    const textPartsArray = measure('merge\'n\'sort', rawStrings, (rawString, i) => {
        const array = findChannelResult[i].concat(findLinkResult[i]);
        return array.concat(fill(array, rawString)).sort((a, b) => a.start - b.start);
    });

    const result = measure('final', textPartsArray, (textParts, i) => {

        const frags = fragments[i].map((fragment, j, array) => {

            const start = j === 0 ? 0 : array[j - 1].end;
            const end = start + fragment.text.length;

            fragment.start = start;
            fragment.end = end;

            return fragment;
        });

        return textParts.map(textPart => {

            const fragments = frags
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

            return Object.assign({}, textPart, { fragments: fragments });
        });
    });

    measure('TOTAL', input, input => parse(input));


    console.log();

    return result;
}

inputStrings.forEach(inputString => benchmark(inputString));
