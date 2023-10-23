import {createClosableContainer} from "../util/closable-container-generator.js";
import {replaceKeyExpression} from "../util/key-name-replacer.js";
import {insertValue} from "../util/dom-inserter.js";
import {createSimpleClassDom} from "../util/dom-creator.js";

function createObjectDom(object) {
    if (!object) return '';

    const $table = createSimpleClassDom('table', 'w-100');

    for (const property of Object.keys(object)) {
        const $tr = document.createElement('tr');
        const $key = createSimpleClassDom('td', 'property');
        const $value = createSimpleClassDom('td', 'content');

        $key.innerHTML = replaceKeyExpression(property, object[property]);
        insertValue($value, distributeValueType(object[property]));

        $tr.appendChild($key);
        $tr.appendChild($value);
        $table.appendChild($tr);
    }

    return $table;
}

function value2String(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    else return value.toString;
}

function distributeValueType(value) {
    const type = typeof value;
    if (type === 'object') {
        return Array.isArray(value) ? createClosableContainer(createObjectDom(value), "펼치기/숨기기") : createObjectDom(value);
    }
    return value2String(value);
}

export function createTableForm(json, $parent) {
    const $tableForm = distributeValueType(json);
    $parent.innerHTML = '';
    insertValue($parent, $tableForm);
}
