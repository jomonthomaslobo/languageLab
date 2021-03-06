'use strict';

/** 
 * @description Synthesise and Recognise speech from Browser. 
 */
class DiffHelper {
    constructor() {
        this._delpatteren = /(?<del><del>\s*(?<delString>(.*?))\s*<\/del>)/gmi;
        this._inspatteren = /(?<ins><ins>\s*(.*?)\s*<\/ins>)/gmi;
        this._revisedDelTag = '<a href="#" onclick="myfunc(\'$<delString>\')">$<del></a>';
    }

    /** @description Speak out all the text passed in to the system.
     * @param {string} message to be spoken.         
     */
    getmodifiedDiffString(sourceString, mutedString, callbackDelFunc = "delCallBack", callbackInsFunc = "insCallBack") {
        let modifiedDiffString = "",
            diff = "";
        this._revisedDelTag = '<a href="#" onclick="' + callbackDelFunc + '(\'$<delString>\')"> <i class="fa fa-volume-up "></i> $<del></a>';
        try {
            diff = diffString(sourceString, mutedString);
            modifiedDiffString = diff.replace(this._delpatteren, this._revisedDelTag);
        } catch (exp) {
            console.log('exception ocured.', exp.message)
        }
        return modifiedDiffString;
    }

    getAssessmentStats(message) {
        let deletedWords = message.match(this._delpatteren).length;
        let insertedwords = message.match(this._inspatteren).length;
        return { 'deletedWords': deletedWords, 'insertedwords': insertedwords };
    }
}