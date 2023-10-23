export function replaceKeyExpression(key, value) {
    if (typeof value === 'object'){
        return Array.isArray(value) ? `${key} : []` : `${key} : {}`;
    }
    return key;
}