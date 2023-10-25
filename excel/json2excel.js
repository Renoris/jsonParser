import {replaceKeyExpression} from "../util/key-name-replacer.js";

function getRowNumStateFunctions() {
    let _rowNum = 1;

    function resetRow () {
        _rowNum = 1;
    }

    function getRow() {
        return _rowNum;
    }

    function addRow() {
        _rowNum++;
    }

    return {
        resetRow,
        getRow,
        addRow
    }
}

function getColumnMaxLengthStateFunctions() {
    let _columnMaxLengthMap = new Map();

    function resetMap() {
        _columnMaxLengthMap = new Map();
    }

    function getMaxCellValueLength(columnIndex) {
        if (!_columnMaxLengthMap.get(columnIndex)) _columnMaxLengthMap.set(columnIndex, 0);
        return _columnMaxLengthMap.get(columnIndex);
    }


    function setMaxCellValueLength(columnIndex, value) {
        if (!_columnMaxLengthMap.get(columnIndex) || _columnMaxLengthMap.get(columnIndex) < value) {
            _columnMaxLengthMap.set(columnIndex, value);
        }
    }

    return {
        resetMap,
        getMaxCellValueLength,
        setMaxCellValueLength
    }

}

function getEndColumnIndexStateFunctions () {

    let _endColumnIndex = 0;

    function resetEndColumn() {
        _endColumnIndex = 0;
    }

    function getEndColumnIndex() {
        return _endColumnIndex;
    }

    function setEndColumnIndex(value) {
        if (_endColumnIndex < value) _endColumnIndex = value;
    }
    return {
        resetEndColumn,
        getEndColumnIndex,
        setEndColumnIndex,
    }
}

const {resetMap, getMaxCellValueLength, setMaxCellValueLength} = getColumnMaxLengthStateFunctions();
const {resetEndColumn, getEndColumnIndex, setEndColumnIndex} = getEndColumnIndexStateFunctions();
const {resetRow, getRow, addRow} = getRowNumStateFunctions();

function resetValue() {
    resetRow();
    resetMap();
    resetEndColumn();
}

function getColumnName(index) {
    return String.fromCodePoint(index + 65);
}

function getCellLocation(columnIndex, row) {
    return `${getColumnName(columnIndex)}${row}`
}

function setBottomIncludeCellDesign(cell) {
    cell.border = {top: {style: 'thin'}, bottom: {style: 'thin'}}
    cell.alignment = {wrapText: true, vertical: 'middle'};
}

function setBottomEmptyCellDesign(cell) {
    cell.border = {top: {style: 'thin'}}
    cell.alignment = {wrapText: true, vertical: 'middle'};
}

function setValueInExcel(value, columnIndex, ws, setDesign) {
    const location = getCellLocation(columnIndex, getRow());
    const cell = ws.getCell(location);
    cell.value = value;
    setDesign(cell)
    setMaxCellValueLength(columnIndex, value.length);
}

function createCell(startColumn, key, value, ws) {
    const replacedKey = replaceKeyExpression(key, value);

    if (typeof value === 'object') {
        if (Object.keys(value).length <= 1) {
            setValueInExcel(replacedKey, startColumn, ws, setBottomIncludeCellDesign);
        } else {
            setValueInExcel(replacedKey, startColumn, ws, setBottomEmptyCellDesign);
        }
        propertyDivide(startColumn + 1, value, ws);
    } else {
        setValueInExcel(replacedKey, startColumn, ws, setBottomIncludeCellDesign);
        setValueInExcel(value, startColumn + 1, ws, setBottomIncludeCellDesign);
        addRow();
        setEndColumnIndex(startColumn + 1);
    }
}

function propertyDivide(startColumn, object, ws) {
    for (const property of Object.keys(object)) {
        createCell(startColumn, property, object[property], ws);
    }
}

function setCellWidth(ws) {
    for (let i = 0; i <= getEndColumnIndex(); i++) {
        const columnName = getColumnName(i);
        const cellValueMaxLength = getMaxCellValueLength(i);

        let width = cellValueMaxLength / 2 > 20 ? cellValueMaxLength / 2 : 20;
        width = Math.min (width, 180);

        const column = ws.getColumn(columnName);
        column.width = width;
    }
}

function convertObjectToWorkSheet(json, wb) {
    const ws = wb.addWorksheet('json');
    let startColumnIndex = 0;
    propertyDivide(startColumnIndex, json, ws);
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

        maxCell.border.bottom = {style: 'medium'}
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

export function json2excelFile(json) {
    resetValue();
    const workbook = new ExcelJS.Workbook();
    const ws = convertObjectToWorkSheet(json, workbook);
    setCellWidth(ws);
    setBorderOutLine(ws);
    download(workbook);
}

function download(workbook) {
    workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'json.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    });
}