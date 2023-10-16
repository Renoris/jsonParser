function createObjectDom(object) {
    if (!object) return '';

    const $table = document.createElement('table');

    for (const property of Object.keys(object)) {
        console.log(property);
        createKeyValue2TrTd(property, object, $table);
    }

    return $table;
}

function createDefaultDom(value) {
    if (!value) return;
    if (typeof value === 'string') return value;
    else return value.toString;
}

function shapeProvider(value) {
    const type = typeof value;
    if (type === 'object') {
        return createObjectDom(value);
    }

    return createDefaultDom(value);
}

export function createTreeForm(json, $parent) {
    const $tableForm = shapeProvider(json);
    $parent.innerHTML = '';

}