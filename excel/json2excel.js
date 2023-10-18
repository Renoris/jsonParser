
let rowNum = 1;
let endColumnIndex = 0;

function getRow() {
    return rowNum;
}

function addRow() {
    rowNum++;
}

function getEndColumnIndex () {
    return endColumnIndex;
}

function refreshEndColumnIndex (value) {
    if (endColumnIndex < value) endColumnIndex = value;
}


function getColumn(index) {
    return String.fromCodePoint(index+65);
}

function setValueInExcel(value, columnIndex, ws) {
    const location = `${getColumn(columnIndex)}${getRow()}`;

    if (!ws[location]) {
        ws[location] = { v: value , t:'s'};
    } else {
        ws[location].v = value;
    }
}

function addTypeNameInProperty(key, value) {
    if (typeof value === 'object') {
        return Array.isArray(value) ? `${key} : []` : `${key} : {}`;
    }
    return key;
}

function createCell(startColumn, key, value, ws) {
    setValueInExcel(addTypeNameInProperty(key, value), startColumn, ws);
    if (typeof value === 'object') {
        propertyDivide(startColumn+1, value, ws);
    }
    else {
        setValueInExcel(value, startColumn+1, ws);
        addRow();
        refreshEndColumnIndex(startColumn+1);
    }
}

function propertyDivide (startColumn, object, ws) {
    for (const property of Object.keys(object)) {
        createCell(startColumn, property, object[property], ws);
    }
}

function convertObjectToWorkBook(object) {
    const ws = XLSX.utils.aoa_to_sheet([]);

    propertyDivide(0, object, ws);

    return ws;
}

export function xlsxBtnClickEventListener() {

    //워크북 생성
    const wb = XLSX.utils.book_new();

    const $textarea = document.getElementById("json-text-area");
    const value = $textarea.value;
    if (!value) return;

    const result = JSON.parse(value);

    const ws = convertObjectToWorkBook(result);

    //없으면 빈 문서 나옴
    ws['!ref'] = `A1:${getColumn(getEndColumnIndex())}${getRow()}`
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    XLSX.writeFile(wb, "jsonToExcel.xlsx");
}