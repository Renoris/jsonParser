

function createKeyValue2TrTd(finder, jsonObject, $table) {
    const $tr = document.createElement('tr');
    const $key = document.createElement('td');
    const $value = document.createElement('td');

    $key.innerHTML = finder.toString();
    insertValue($value, shapeProvider(jsonObject[finder]));

    $tr.appendChild($key);
    $tr.appendChild($value);
    $table.appendChild($tr);
}

function insertValue(parent, value) {
    if (typeof value === 'object') parent.appendChild(value);
    else parent.innerHTML = value;
}

function createOpenAndCloseContainer($dom) {
    const $hideBtn = document.createElement('div');
    $hideBtn.innerText = "펼치기/숨기기";
    $hideBtn.classList.add('open-hide');
    $hideBtn.addEventListener('click', () => {
        $contentWrapper.classList.toggle('hide');
    })

    const $contentWrapper = document.createElement('div');
    $contentWrapper.appendChild($dom);

    const $container = document.createElement('div');
    $container.appendChild($hideBtn);
    $container.appendChild($contentWrapper);

    return $container;
}

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
        return Array.isArray(value) ? createOpenAndCloseContainer(createObjectDom(value)) : createObjectDom(value);

    }
    return createDefaultDom(value);
}

export function createTableForm(json, $parent) {
    const $tableForm = shapeProvider(json);
    $parent.innerHTML = '';
    insertValue($parent, $tableForm());
}
