let _rowNum = 1;
let _endColumnIndex = 0;

function resetValue() {
    _rowNum = 1;
    _endColumnIndex = 0;
}

function getRow() {
    return _rowNum;
}

function addRow() {
    _rowNum++;
}

function getEndColumnIndex() {
    return _endColumnIndex;
}

function refreshEndColumnIndex(value) {
    if (_endColumnIndex < value) _endColumnIndex = value;
}

function createDefaultCell(value) {
    return {v: value, t: 's', s: {alignment: {wrapText: true}}};
}

function getColumn(index) {
    return String.fromCodePoint(index + 65);
}

function setValueInExcel(value, columnIndex, ws) {
    const location = `${getColumn(columnIndex)}${getRow()}`;

    if (!ws[location]) {
        ws[location] = createDefaultCell(value);
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
        propertyDivide(startColumn + 1, value, ws);
    } else {
        setValueInExcel(value, startColumn + 1, ws);
        addRow();
        refreshEndColumnIndex(startColumn + 1);
    }
}

function propertyDivide(startColumn, object, ws) {
    for (const property of Object.keys(object)) {
        createCell(startColumn, property, object[property], ws);
    }
}

function convertObjectToWorkBook(object) {
    const ws = XLSX.utils.aoa_to_sheet([]);

    propertyDivide(0, object, ws);

    return ws;
}

function getXlsxRange() {
    return `A1:${getColumn(getEndColumnIndex())}${getRow()}`;
}

function createOutLastBorder(ws) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let r = range.s.r; r <= range.e.r; r++) {
        const cellAddressS = XLSX.utils.encode_cell({r: r, c: range.s.c});
        let cellS = ws[cellAddressS];
        if (!cellS) cellS = {};
        if (!cellS.s) cellS.s = {};
        cellS.s.border = {left: {style: "thin", color: {auto: 1}}};


    }
}


export function xlsxBtnClickEventListener() {

    resetValue();

    //워크북 생성
    const $textarea = document.getElementById("json-text-area");
    const value = $textarea.value;
    if (!value) return;

    const result = JSON.parse(value);

    const ws = convertObjectToWorkBook(result);

    //없으면 빈 문서 나옴
    ws['!ref'] = getXlsxRange();
    createOutLastBorder(ws);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "sheet1");
    XLSX.writeFile(wb, "jsonToExcel.xlsx");
}