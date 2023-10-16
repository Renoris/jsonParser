import {createTableForm} from "./json2table.js";

function getJSONFileReader(onLoad) {
    const reader = new FileReader();
    reader.onload = onLoad;
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

function onLoadJSON (e) {
    try {
        const jsonContent = e.target.result;
        const result = JSON.parse(jsonContent);
        const $jsonContainer = document.getElementById('json-container');
        createTableForm(result, $jsonContainer);

    }catch (error) {
        console.error("JSON 파싱 오류: " + error);
    }
}

function initEventListener () {
    const btn = document.getElementById("file-add-btn");
    const fileInput = document.getElementById("file")
    const jsonParseBtn = document.getElementById("json-parse-btn");

    const reader = getJSONFileReader(onLoadJSON)

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    })

    jsonParseBtn.addEventListener('click', () => {
        const fileInput = document.getElementById("file");
        const file = fileInput.files[0];
        if (!file) return;
        reader.readAsText(file);
    })
}

initEventListener();