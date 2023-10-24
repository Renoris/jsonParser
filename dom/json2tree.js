import {createClosableContainer} from "../util/closable-container-generator.js";
import {replaceKeyExpression} from "../util/key-name-replacer.js";
import {insertValue} from "../util/dom-inserter.js";
import {createSimpleClassDom} from "../util/dom-creator.js";

function createChildDom(key, object) {
    const replacedKey = replaceKeyExpression(key, object);

    if (typeof object === 'object') {
        return createClosableContainer(distributeProperty(object), replacedKey);
    }

    return createValueDom(replacedKey, object);
}

function createValueDom(key, value) {
    if (!value) return '';
    if (!key) return '';
    const $container = document.createElement('div');
    const $keyDom = document.createElement('div');
    $keyDom.innerHTML = key;
    const $valueDom = createSimpleClassDom('div', 'pdl-25');
    $valueDom.innerHTML = value;

    $container.appendChild($keyDom);
    $container.appendChild($valueDom);
    return $container;
}

function distributeProperty(object) {
    if (!object) return '';

    const $ul = createSimpleClassDom('ul', 'pdl-25');

    for (const property of Object.keys(object)) {
        const $li = createSimpleClassDom('li', 'content');
        const $child = createChildDom(property, object[property]);
        insertValue($li, $child);
        $ul.appendChild($li);
    }

    return $ul;
}

export function createTreeForm(json, $parent) {
    const $tableForm = distributeProperty(json);
    $parent.innerHTML = '';
    insertValue($parent, $tableForm);
}