import {createTableForm} from "./dom/json2table.js";
import {createTreeForm} from "./dom/json2tree.js";
import {parse} from "./parser/json-parser.js";
import {json2excelFile} from "./excel/json2excel.js";

function getJSONFileReader($element) {
    const reader = new FileReader();
    reader.onload = function onLoadJSON(e) {
        try {
            const jsonContent = e.target.result;
            $element.value = jsonContent.toString();
        } catch (error) {
            console.error("파일로드 에러: " + error);
        }
    }
    reader.onerror = function (e) {
        console.log("파일로드 에러");
    }
    reader.onabort = function (e) {
        console.log("파일 취소");
    }
    reader.onprogress = function (e) {
        console.log("진행중");
    }
    return reader;
}

const jsonParseBtnClickEvent = () => {
    const $textarea = document.getElementById("json-text-area");
    const value = $textarea.value;
    if (!value) return;

    const result = parse(value);
    const $tableForm = document.getElementById('table-form');
    $tableForm.innerHTML = '';
    createTableForm(result, $tableForm);

    const $treeForm = document.getElementById('tree-form');
    $treeForm.innerHTML = '';
    createTreeForm(result, $treeForm);
}

function hideUnUsable(view) {
    const $tableForm = document.getElementById('table-form');
    const $treeForm = document.getElementById('tree-form');
    if (view === 'table') {
        $tableForm.classList.remove('hide');
        $treeForm.classList.add('hide');
    } else {
        $treeForm.classList.remove('hide');
        $tableForm.classList.add('hide');
    }
}

function typeConvertBtnClickEventListener(e) {
    let type = e.target.value;
    if (type === 'table') type = 'tree';
    else type = 'table';

    hideUnUsable(type);

    e.target.value = type;
}

function jsonInputBtnClickEventListener(e, fileInput) {
    e.preventDefault();
    fileInput.click();
}

function fileInputChangeEventListener(e, reader) {
    const file = e.target.files[0];
    if (!file) return;
    reader.readAsText(file);
}

function xlsxBtnClickEventListener() {
    const $textarea = document.getElementById("json-text-area");
    const value = $textarea.value;
    if (!value) return;
    const json = parse(value);
    json2excelFile(json);
}

(function initEventListener() {
    const $jsonBtn = document.getElementById("file-add-btn");
    const $fileInput = document.getElementById("file")
    const $jsonParseBtn = document.getElementById("json-parse-btn");
    const $typeConvertBtn = document.getElementById('type-convert-btn');
    const $excelDownloadBtn = document.getElementById('excel-download-btn');
    const $textArea = document.getElementById('json-text-area');
    const reader = getJSONFileReader($textArea);

    $jsonBtn.addEventListener('click', (e) => jsonInputBtnClickEventListener(e, $fileInput));
    $fileInput.addEventListener('change', (e) => fileInputChangeEventListener(e, reader))
    $jsonParseBtn.addEventListener('click', jsonParseBtnClickEvent);
    $typeConvertBtn.addEventListener('click', (e) => typeConvertBtnClickEventListener(e));
    $excelDownloadBtn.addEventListener('click', xlsxBtnClickEventListener);
})();