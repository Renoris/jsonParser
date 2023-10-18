
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

function createCell(startColumn, key, value, ws) {
    setValueInExcel(key, startColumn, ws);
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
    ws['!ref'] = `A1:${getColumn(getEndColumnIndex())}${getRow()}`

    var newWsData = [
        ["Data", "Goes", "Here"],
        [1, 2, 3],
        ["More", "Data", "Here"]
    ];

    var newWs = XLSX.utils.aoa_to_sheet(newWsData);

    console.log(newWs);

    console.log(ws);
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    console.log(wb);
    XLSX.writeFile(wb, "example.xlsx");
    console.log('aaa')
}