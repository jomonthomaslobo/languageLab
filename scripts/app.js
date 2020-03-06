'use strict';

let speechHelper = new SpeechHelper();
let stringDiff = new DiffHelper();

function cleanText(message) {
    try {
        let pattern = /[^A-Za-z0-9\s]/g;
        message = message.replace(pattern, '').toLowerCase();
    } catch (exp) {
        console.log(exp.message);
    }
    return message;
}

function analyseAssessment(wordsStats) {
    //{deletedWords: 14, insertedwords: 6, sourceWords: 32, spokenWords: 24}
    let html = " Source Words : " + wordsStats.sourceWords + " Spoken Words : " + wordsStats.spokenWords +
        " removed words : " + wordsStats.deletedWords + "new words :" + wordsStats.insertedwords +
        " Accuracy : " + (wordsStats.sourceWords - wordsStats.deletedWords) / wordsStats.sourceWords;
    divAnalysisArea.innerHTML = html;
}

function getTextToRead() {
    var node = document.getElementById('dvTextToRead');
    return cleanText(node.innerText);
}

function getSpokenText() {
    var node = document.getElementById('dvSpokenText');
    return cleanText(node.innerText);
}

function delCallBack(data) {
    speechHelper.speak(data);
}

function speakTextCompletionCallBack() {
    btnSpeak.disabled = false;
}

function speechCallBack(response) {
    dvSpokenText.innerHTML = response;
}

btnSpeak.addEventListener('click', () => {
    btnSpeak.disabled = true;
    let msg = getTextToRead();
    let speech = new SpeechHelper();
    speech.speak(msg, speakTextCompletionCallBack);
});

btnStartRecognise.addEventListener('click', () => {
    speechHelper.startSpeechRecognition(speechCallBack);
    divbtnStartRecognise.className = "hideme";
    //document.getElementById("divbtnStartRecognise").className = "hideme";
    document.getElementById("divbtnStopRecognise").className = "showme";
});
btnStopRecognise.addEventListener('click', () => {
    speechHelper.stopSpeechRecognition();
    document.getElementById("divbtnStartRecognise").className = "showme";
    document.getElementById("divbtnStopRecognise").className = "hideme";
});

btnAssessReading.addEventListener('click', () => {
    let sourceText = getTextToRead();
    let spokenText = getSpokenText();
    let diffResult = stringDiff.getmodifiedDiffString(sourceText, spokenText, 'delCallBack');
    dvDiffArea.innerHTML = diffResult;
    let wordsStats = stringDiff.getAssessmentStats(diffResult);
    wordsStats['sourceWords'] = sourceText.split(' ').length;
    wordsStats['spokenWords'] = spokenText.split(' ').length;
    analyseAssessment(wordsStats);
});