import {createClosableContainer} from "../util/closableContainerGenerator.js";

function insertValue(parent, value) {
    if (typeof value === 'object') parent.appendChild(value);
    else parent.innerHTML = value;
}

function createSimpleClassDom (tagName, className) {
    const $dom = document.createElement(tagName);
    $dom.classList.add(className);
    return $dom;
}

function replaceKeyExpression(key, value) {
    if (typeof value === 'object')return Array.isArray(value) ? `${key} : []` : `${key} : {}`;
    return key;
}

function createObjectDom(object) {
    if (!object) return '';

    const $table = document.createElement('table');

    for (const property of Object.keys(object)) {
        const $tr = document.createElement('tr');
        const $key = createSimpleClassDom('td', 'property');
        const $value = createSimpleClassDom('td', 'content');

        $key.innerHTML = replaceKeyExpression(property, object[property]);
        insertValue($value, shapeProvider(object[property]));

        $tr.appendChild($key);
        $tr.appendChild($value);
        $table.appendChild($tr);
    }

    return $table;
}

function createDefaultDom(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    else return value.toString;
}

function shapeProvider(value) {
    const type = typeof value;
    if (type === 'object') {
        return Array.isArray(value) ? createClosableContainer(createObjectDom(value), "펼치기/숨기기") : createObjectDom(value);
    }
    return createDefaultDom(value);
}

export function createTableForm(json, $parent) {
    const $tableForm = shapeProvider(json);
    $parent.innerHTML = '';
    insertValue($parent, $tableForm);
}
