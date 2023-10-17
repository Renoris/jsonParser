import {createClosableContainer} from "./closableContainerGenerator.js";

function replaceKeyExpression(key, type) {
    if (type === 'object') return `· {} ${key}`
    else if (type === 'array') return `· [] ${key}`;
    else return `· ${key}`;
}


function createSimpleClassDom (tagName, className) {
    const $dom = document.createElement(tagName);
    $dom.classList.add(className);
    return $dom;
}

function createNodeDom(key, object) {
    if (typeof object === 'object') {
        if (Array.isArray(object)) return createClosableContainer(distributeProperty(object),  replaceKeyExpression(key, 'array'));
        return createClosableContainer(distributeProperty(object), replaceKeyExpression(key, 'object'));
    }

    return createDefaultDom(replaceKeyExpression(key, 'normal'), object);
}

function createDefaultDom(key, value) {
    if (!value) return '';
    if (!key) return '';
    const $container = document.createElement('div');
    const $keyDom = document.createElement('div');
    $keyDom.innerHTML = `${key} :`;
    const $valueDom = createSimpleClassDom('div', 'pdl-15');
    $valueDom.innerHTML = value;

    $container.appendChild($keyDom);
    $container.appendChild($valueDom);
    return $container;
}

function insertValue(parent, value) {
    if (typeof value === 'object') parent.appendChild(value);
    else parent.innerHTML = value;
}

function distributeProperty (object) {
    if (!object) return '';

    const $ul = createSimpleClassDom('ul', 'pdl-15');

    for (const property of Object.keys(object)) {
        const $li = createSimpleClassDom('li', 'content');
        const $child = createNodeDom(property, object[property]);
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