
let _rowNum = 1;
let _endColumnIndex = 0;
let _columnMaxMap = new Map();

function getMaxCellValueLength(index) {
    if (!_columnMaxMap.get(index)) _columnMaxMap.set(index, 0);
    return _columnMaxMap.get(index);
}

function getCellLocation(columnIndex, row) {
    return `${getColumnName(columnIndex)}${row}`
}

function getEndColumnIndex () {
    return _endColumnIndex;
}

function setMaxCellValueLength(index, value) {
    if (!_columnMaxMap.get(index) < value) {
        _columnMaxMap.set(index, value);
    }
}

function resetValue() {
    _rowNum = 1;
    _endColumnIndex = 0;
    _columnMaxMap = new Map();
}

function getRow() {
    return _rowNum;
}

function addRow() {
    _rowNum++;
}

function refreshEndColumnIndex (value) {
    if (_endColumnIndex < value) _endColumnIndex = value;
}

function getColumnName(index) {
    return String.fromCodePoint(index+65);
}

function setValueInExcel(value, columnIndex, ws) {
    const location = getCellLocation(columnIndex, getRow());
    const cell = ws.getCell(location);
    cell.value = value;
    cell.border = {top: {style: 'thin'}}
    cell.alignment = {wrapText: true, vertical: 'middle'};
    setMaxCellValueLength(columnIndex, value.length);
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

function setCellWidth(ws) {
    for (let i = 0; i <= _endColumnIndex; i++) {
        const columnName = getColumnName(i);
        const cellValueMaxLength = getMaxCellValueLength(i);

        const column = ws.getColumn(columnName);
        let width = 5;
        if (cellValueMaxLength > 4) {
            width = 10;
        }
        if (cellValueMaxLength > 10) {
            width = 70;
        }

        if (cellValueMaxLength > 40) {
            width = 200;
        }

        column.width = width;
    }
}

function convertObjectToWorkSheet(json, wb) {
    const ws = wb.addWorksheet('json');
    propertyDivide(0, json, ws);
    return ws;
}

function setBorderOutLine(ws) {
    for (let column = 0; column <= getEndColumnIndex(); column++) {
        const minRLocation = getCellLocation(column, 1);
        const minCell = ws.getCell(minRLocation);
        if (!minCell.border) minCell.border = {};
        minCell.border.top = {style: 'medium'}

        const endRLocation = getCellLocation(column, getRow() - 1)
        const maxCell = ws.getCell(endRLocation);
        if (!maxCell.border) maxCell.border = {};

        maxCell.border.bottom= {style: 'medium'}
    }

    for (let row = 1; row < getRow(); row++) {
        const minCLocation = getCellLocation(0, row);
        const minCell = ws.getCell(minCLocation);
        if (!minCell.border) minCell.border = {};
        minCell.border.left = {style: 'medium'}

        const endCLocation = getCellLocation(getEndColumnIndex(), row);
        const maxCell = ws.getCell(endCLocation);
        if (!maxCell.border) maxCell.border = {};
        maxCell.border.right = {style: 'medium'}
    }

}

export function xlsxBtnClickEventListener() {
    resetValue();

    //워크북 생성
    const $textarea = document.getElementById("json-text-area");
    const value = $textarea.value;
    if (!value) return;

    const result = JSON.parse(value);
    const workbook = new ExcelJS.Workbook();
    const ws = convertObjectToWorkSheet(result, workbook);
    setCellWidth(ws);
    setBorderOutLine(ws);
    console.log(ws);
    download(workbook);

}
function download(workbook) {
    workbook.xlsx.writeBuffer().then(function(data) {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'json.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    });
}