import fs from "fs";
import path from "path";
import {osLocaleSync} from "os-locale";


/**
 * i18nLanguageArr
 *
 * @type Array<string>
 * */
const i18nLanguageArr = [];

/**
 * i18nObj
 * @type Object
 * */
const i18nObj = {};

/**
 * readI18nFile
 *
 * @const
 * @function
 * @param { string } i18nDirPath - i18n folder path
 * @return { Object } i18n translation text object, key is the specified i18n language file name, and value is the JSON file object
 * */
const readI18nFile = function (i18nDirPath) {
    const reObj = {};

    const i18nFileNameArr = fs.readdirSync(i18nDirPath);
    i18nFileNameArr.forEach((fileName) => {
        const fileData = fs.readFileSync(path.resolve(i18nDirPath, fileName));

        const fileNameChipArr = fileName.split('.');
        reObj[fileNameChipArr[0]] = JSON.parse(fileData.toString());
    });

    return reObj;
}

/**
 * i18nInit - Reinitialization is supported, the reinitialization content will overwrite the original i18nObj and i18nLanguageArr
 *
 * @export
 * @const
 * @function
 * @param { string } [i18nDirPath = path.resolve('./', 'i18n')] - i18n folder path
 * */
export const i18nInit = function (i18nDirPath = path.resolve('./', 'i18n')) {
    // read i18n file
    const i18nFileObj = readI18nFile(i18nDirPath);
    Object.keys(i18nFileObj).forEach((key) => {
        // update i18nObj
        i18nObj[key] = i18nFileObj[key];

        // update i18nLanguageArr
        i18nLanguageArr.push(key);
    });
}

/**
 * i18nGuard
 *
 * @const
 * @function
 * @param { string } key - key of i18n
 * @param { string } language - Specifies the language
 * @throws { ReferenceError } - 1.Thrown when the i18n file for the specified 'language' does not exist
 * @throws { ReferenceError } - 2.Thrown when the specified 'key' does not exist in the i18n file of the specified 'language'
 * */
const i18nGuard = function (key, language) {
    // Detects the presence of the specified i18n file
    const hasI18nSet = new Set(i18nLanguageArr);
    if (!hasI18nSet.has(language)) {
        throw ReferenceError(i18n('SyntaxError-i18nGuard-1', {
            language: language
        }));
    }

    // Checks whether the specified i18n file contains the specified key
    const i18nDataSet = new Set(Object.keys(i18nObj[language]));
    if (!i18nDataSet.has(key)) {
        throw ReferenceError(i18n('SyntaxError-i18nGuard-2', {
            language: language,
            key: key
        }));
    }
}

/**
 * regReplace
 *
 * @const
 * @function
 * @param { string } text - Text that needs to be replaced
 * @param { Object } replaceObj - replacement object for text
 * @return { string } Replaced text
 * @throws { ReferenceError } - Thrown when the 'replaceObj' is missing the specified replacement keyword
 * */
const regReplace = function (text, replaceObj) {
    const replaceReg = new RegExp(/\${(.+?)}/);

    let execResult = null;
    while (execResult = replaceReg.exec(text)) {
        const replaceKey = execResult[1].trim();

        if (replaceObj[replaceKey] !== void 0) {
            text = text.replace(replaceReg, replaceObj[replaceKey]);
        } else {
            throw ReferenceError(i18n('ReferenceError-regReplace', {
                replaceKey: replaceKey
            }));
        }
    }

    return text;
}

/**
 * i18n - i18n Core
 *
 * @export
 * @const
 * @function
 * @param { string } key - key of i18n
 * @param { Object } replaceObj - replacement object for i18n text
 * @param { string } [language = osLocaleSync() || 'en-US'] - Specifies the language. Default is the current user's operating system language. If the operating system language cannot be obtained normally, it defaults to en-US
 * @return { string } i18n text
 * */
export const i18n = function (
    key,
    replaceObj = {},
    language = osLocaleSync() || 'en-US'
) {
    if (Object.keys(i18nObj).length === 0) {
        // i18n init
        i18nInit();
    }

    // Fielding test
    i18nGuard(key, language);

    // Text keyword replace and return
    return regReplace(i18nObj[language][key], replaceObj);
}

export default {
    i18nInit,
    i18n
}
