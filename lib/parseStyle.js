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

const controlCodesRx = /[\u0000-\u001F]/g;

function parseStyle(text, stripControlCodes = true) {

    const result = [];
    let start = 0;
    let position = 0;
    let fragment = initalStyle();

    const getText = () => {
        const textPart = text.slice(start, position);
        start = position + 1;
        if (stripControlCodes) {
            return textPart.replace(controlCodesRx, '');
        }
        return textPart;
    };

    while (position < text.length) {

        switch (text[position]) {

            case RESET:
                fragment.text = getText();
                result.push(fragment);
                fragment = initalStyle();
                break;

            case BOLD:
                fragment.text = getText();
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', bold: !fragment.bold });
                break;

            case COLOR:
                fragment.text = getText();
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', textColor: undefined, bgColor: undefined });

                const colorCodes = text.slice(position + 1).match(colorRx);

                if (colorCodes) {
                    const textColor = Number(colorCodes[1]);
                    const bgColor = Number(colorCodes[2]);
                    if (!Number.isNaN(textColor)) { fragment.textColor = textColor; }
                    if (!Number.isNaN(bgColor)) { fragment.bgColor = bgColor; }
                    position += colorCodes[0].length;
                }
                start = position + 1;
                break;

            case REVERSE:
                fragment.text = getText();
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', reverse: !fragment.reverse });
                break;

            case ITALIC:
                fragment.text = getText();
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', italic: !fragment.italic });
                break;

            case UNDERLINE:
                fragment.text = getText();
                result.push(fragment);
                fragment = Object.assign({}, fragment, { text: '', underline: !fragment.underline });
                break;
        }
        position += 1;
    }

    fragment.text = getText();
    result.push(fragment);

    return result.filter(frag => frag.text);
}

module.exports = parseStyle;
