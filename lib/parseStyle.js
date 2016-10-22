const BOLD = '\x02';
const COLOR = '\x03';
const RESET = '\x0f';
const REVERSE = '\x16';
const ITALIC = '\x1d';
const UNDERLINE = '\x1f';

const colorRx = /^(\d{1,2})(?:,(\d{1,2}))?/;

function initalStyle() {
    return {
        bold: false,
        textColor: undefined,
        bgColor: undefined,
        reverse: false,
        italic: false,
        underline: false,
        text: '',
    };
}

function parseStyle(text) {
    const result = [];
    let position = 0;
    let fragment = initalStyle();
    while (position < text.length) {

        switch (text[position]) {

            case RESET:
                result.push(fragment);
                fragment = initalStyle();
                break;

            case BOLD:
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', bold: !fragment.bold });
                break;

            case COLOR:
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', textColor: undefined, bgColor: undefined });

                const colorCodes = text.slice(position + 1).match(colorRx);

                if (colorCodes) {
                    const textColor = Number(colorCodes[1]);
                    const bgColor = Number(colorCodes[2]);
                    if (!Number.isNaN(textColor) && textColor < 16) { fragment.textColor = textColor; }
                    if (!Number.isNaN(bgColor) && textColor < 16) { fragment.bgColor = bgColor; }
                    position += colorCodes[0].length;
                }
                break;

            case REVERSE:
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', reverse: !fragment.reverse });
                break;

            case ITALIC:
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', italic: !fragment.italic });
                break;

            case UNDERLINE:
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', underline: !fragment.underline });
                break;

            default:
                if (text.charCodeAt(position) < 0x20) {
                    // skip control codes - 0x00-0x19
                } else {
                    fragment.text += text[position];
                }
                break;
        }
        position += 1;
    }

    result.push(fragment);

    return result.filter(frag => frag.text);
}

module.exports = parseStyle;
