export function createSimpleClassDom (tagName, className) {
    const $dom = document.createElement(tagName);
    $dom.classList.add(className);
    return $dom;
}