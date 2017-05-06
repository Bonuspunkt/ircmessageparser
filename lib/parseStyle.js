const BOLD = '\x02';
const COLOR = '\x03';
const HEXCOLOR = '\x04';
const RESET = '\x0f';
const REVERSE = '\x16';
const ITALIC = '\x1d';
const UNDERLINE = '\x1f';

const colorRx = /^(\d{1,2})(?:,(\d{1,2}))?/;
const colorMaxLength = 5;
const hexColorRx = /^([0-9a-f]{6})(?:,([0-9a-f]{6}))?/i;
const hexColorMaxLength = 13;
const controlCodesRx = /[\u0000-\u001F]/g;


function parseStyle(text, stripControlCodes = true) {

    const result = [];
    let start = 0;
    let position = 0;

    let bold, textColor, bgColor, hexTextColor, hexBgColor, reverse, italic, underline;

    const resetStyle = () => {
        bold = false;
        textColor = undefined;
        bgColor = undefined;
        hexTextColor = undefined;
        hexBgColor = undefined;
        reverse = false;
        italic = false;
        underline = false;
    };
    resetStyle();


    const emitFragment = () => {
        const textPart = text.slice(start, position);
        start = position + 1;

        const processedText = stripControlCodes
            ? textPart.replace(controlCodesRx, '')
            : textPart;

        if (!processedText.length) { return; }

        result.push({
            bold,
            textColor,
            bgColor,
            hexTextColor,
            hexBgColor,
            reverse,
            italic,
            underline,
            text: processedText
        });
    };


    while (position < text.length) {

        switch (text[position]) {

            case RESET:
                emitFragment();
                resetStyle();
                break;

            case BOLD:
                emitFragment();
                bold = !bold;
                break;

            case COLOR:
                emitFragment();

                const colorCodes = text.slice(
                    position + 1,
                    position + colorMaxLength + 1
                ).match(colorRx);

                if (colorCodes) {
                    const [wholeMatch, newTextColor, newBgColor] = colorCodes;
                    textColor = Number(newTextColor);
                    if (newBgColor) {
                        bgColor = Number(newBgColor);
                    }
                    position += wholeMatch.length;
                } else {
                    textColor = undefined;
                    bgColor = undefined;
                }
                start = position + 1;
                break;

            case HEXCOLOR:
                emitFragment();

                const hexColorCodes = text.slice(
                    position + 1,
                    position + hexColorMaxLength + 1
                ).match(hexColorRx);

                if (hexColorCodes) {
                    const [wholeMatch, newHexTextColor, newHexBgColor] = hexColorCodes;
                    hexTextColor = newHexTextColor;
                    if (newHexBgColor) {
                        hexBgColor = newHexBgColor;
                    }
                    position += wholeMatch.length;
                } else {
                    hexTextColor = undefined;
                    hexBgColor = undefined;
                }
                start = position + 1;
                break;


            case REVERSE:
                emitFragment();
                reverse = !reverse;
                break;

            case ITALIC:
                emitFragment();
                italic = !italic;
                break;

            case UNDERLINE:
                emitFragment();
                underline = !underline;
                break;
        }
        position += 1;
    }

    emitFragment();

    return result;
}

const properties = [
    'bold',
    'textColor', 'bgColor',
    'hexTextColor', 'hexBgColor',
    'italic',
    'underline',
    'reverse'
];

function prepare(...args) {
    return parseStyle(...args)
        .filter(fragment => fragment.text.length)
        .reduce((prev, curr, i) => {
            if (i === 0) {
                return prev.concat([curr]);
            }

            const lastEntry = prev[prev.length - 1];
            if (properties.some(key => curr[key] !== lastEntry[key])) {
                return prev.concat([curr]);
            }

            lastEntry.text += curr.text;
            return prev;
        }, [])
        .map((fragment, i, array) => {
            fragment.start = i === 0 ? 0 : array[i - 1].end;
            fragment.end = fragment.start + fragment.text.length;
            return fragment;
        });
}

module.exports = prepare;
