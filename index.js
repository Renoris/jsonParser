import {createTableForm} from "./dom/json2table.js";
import {createTreeForm} from "./dom/json2tree.js";
import {xlsxBtnClickEventListener} from "./excel/json2excel.js";
import {parse} from "./parser/JsonParser.js";

function getJSONFileReader() {
    const reader = new FileReader();
    reader.onload = function onLoadJSON (e) {
        try {
            const jsonContent = e.target.result;

            const $textarea = document.getElementById('json-text-area');
            $textarea.innerText = jsonContent.toString();
        }catch (error) {
            console.error("JSON 파싱 오류: " + error);
        }
    }
    reader.onerror = function (e) {
        console.log("파일로드 에러");
    }
    reader.onabort = function (e) {
        console.log ("파일 취소");
    }
    reader.onprogress = function (e) {
        console.log ("진행중");
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

function hideUnUsable (view) {
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
    let type = e.target.innerHTML;
    if (type === 'table') type = 'tree';
    else type = 'table';

    hideUnUsable(type);

    e.target.innerHTML = type;

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

function initEventListener () {
    const jsonBtn = document.getElementById("file-add-btn");
    const fileInput = document.getElementById("file")
    const jsonParseBtn = document.getElementById("json-parse-btn");
    const typeConvertBtn = document.getElementById('type-convert-btn');
    const excelDownloadBtn = document.getElementById('excel-download-btn');
    const reader = getJSONFileReader();

    typeConvertBtn.addEventListener('click', (e) => typeConvertBtnClickEventListener(e));
    jsonBtn.addEventListener('click', (e) => jsonInputBtnClickEventListener(e, fileInput));
    fileInput.addEventListener('change', (e) => fileInputChangeEventListener(e, reader))
    jsonParseBtn.addEventListener('click', jsonParseBtnClickEvent);
    excelDownloadBtn.addEventListener('click', xlsxBtnClickEventListener);
}

function init() {
    initEventListener();

}


init();