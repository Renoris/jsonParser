function getSpecialCharIndex(value) {
    if (value.slice(0,1) !== "{") {
        return null;
    }
    const regex = /[\\,"\[\]{}:]/g;

    const specialCharIndexes = value
        .split('')
        .map((char, index) => {
            if (char.match(regex)) return index;
            else return -1;
        })
        .filter((item) => item !== -1);

    specialCharIndexes.shift();

    return specialCharIndexes;
}

function createArray (value, specialCharIndexes) {
    let isValueRead = false;
    let startValueIndex = 0;

    const array = [];

    while (specialCharIndexes.length > 0) {
        const index = specialCharIndexes.shift();
        const alpha = value[index];
        if (isDoubleQuotes(alpha)) {
            if (isValueRead) {
                array.push(value.slice(startValueIndex, index));
            }else {
                startValueIndex = index+1;
            }
            isValueRead = !isValueRead
        }

        if (isOpenCurlyBracket(alpha)) {
            array.push(createObject(value, specialCharIndexes));
        }

        if (isOpenSquareBracket(alpha)) {
            array.push(createArray(value, specialCharIndexes));
        }

        if (isCloseSquareBracket(alpha)) {
            return array;
        }

    }
}

function createObject(value, specialCharIndexes) {
    let isProperty = true;
    let propertyName = '';
    let isValueRead = false;
    let startValueIndex = 0;
    const object = {};

    while (specialCharIndexes.length > 0) {
        const index = specialCharIndexes.shift();
        const alpha = value[index];
        const frontAlpha = value[index-1];

        if (isBackSlash(frontAlpha)) continue;

        if (!isValueRead) {
            if (isOpenSquareBracket(alpha)) {
                object[propertyName] = createArray(value, specialCharIndexes);
                continue;
            }
            if (isOpenCurlyBracket(alpha)) {
                object[propertyName] = createObject(value, specialCharIndexes);
                continue;
            }
            if (isCloseCurlyBracket(alpha)) {
                return object;
            }
            if (isColon(alpha)) {
                isProperty = false;
                continue;
            }
            if (isComma(alpha)) {
                isProperty = true;
                continue;
            }
        }

        if (isDoubleQuotes(alpha)) {
            if (isProperty) {
                if (isValueRead) {
                    propertyName = value.slice(startValueIndex, index);
                }else {
                    startValueIndex = index+1;
                }
            } else {
                if (isValueRead) {
                    object[propertyName] = value.slice(startValueIndex, index);
                }else {
                    startValueIndex = index+1;
                }
            }
            isValueRead = !isValueRead
        }

    }

    return object;
}




function isJson(value) {
    let array = [];
    for (const alpha of value) {
        if (isOpenCurlyBracket(alpha) || isOpenSquareBracket(alpha)) {
            array.push(alpha);
        } else if (isCloseCurlyBracket(alpha)) {
            const last = array.pop();
            if (!isOpenCurlyBracket(last)) return false;
        } else if (isCloseSquareBracket(alpha)) {
            const last = array.pop();
            if (!isOpenSquareBracket(last)) return false;
        }
    }

    return array.length === 0;
}

/**
 *
 * @param value {string}
 */
export function parse(value) {
    if (!isJson(value)) Error("json 형태가 아닙니다");
    const specialCharIndexes = getSpecialCharIndex(value);
    return createObject(value, specialCharIndexes);
}

function isSpecialRegex(value) {
    return /[\\",\[\]{}:]/g;
}

function isColon(value) {
    return value === ':';
}

function isComma(value) {
    return value === ',';
}

function isBackSlash(value) {
    return value === '\\';
}

function isDoubleQuotes(value) {
    return value === '"';
}

function isOpenSquareBracket(value) {
    return value === '[';
}

function isCloseSquareBracket(value) {
    return value === ']';
}

function isOpenCurlyBracket(value) {
    return value === '{';
}

function isCloseCurlyBracket(value) {
    return value === '}';
}