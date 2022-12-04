import fs from "fs";
import path from "path";
import child_process from "child_process";
import { osLocaleSync } from "os-locale";


/**
 * userLanguage
 *
 * @type String
 * */
const userLanguage = osLocaleSync() || 'en-US';

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
 * i18nBuildInObj
 *
 * @type Object
 * */
const i18nBuildInObj = {};

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
 * @param { Object } [i18nTable = i18nObj] - i18n table to be initialized
 * */
export const i18nInit = function (
    i18nDirPath = path.resolve('./', 'i18n'),
    i18nTable = i18nObj
) {
    // read i18n file
    const i18nFileObj = readI18nFile(i18nDirPath);
    Object.keys(i18nFileObj).forEach((key) => {
        // update i18nObj
        i18nTable[key] = i18nFileObj[key];

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
 * @param { Object } i18nTable - Selected i18n table
 * @throws { ReferenceError } - 1.Thrown when the i18n file for the specified 'language' does not exist
 * @throws { ReferenceError } - 2.Thrown when the specified 'key' does not exist in the i18n file of the specified 'language'
 * */
const i18nGuard = function (key, language, i18nTable) {
    // Detects the presence of the specified i18n file
    const hasI18nSet = new Set(i18nLanguageArr);
    if (!hasI18nSet.has(language)) {
        throw ReferenceError(i18n('SyntaxError-i18nGuard-1', {
            language: language
        }, userLanguage, true));
    }

    // Checks whether the specified i18n file contains the specified key
    const i18nDataSet = new Set(Object.keys(i18nTable[language]));
    if (!i18nDataSet.has(key)) {
        throw ReferenceError(i18n('SyntaxError-i18nGuard-2', {
            language: language,
            key: key
        }, userLanguage, true));
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
            }, userLanguage, true));
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
 * @param { boolean } [isUseBuildInLibrary = false] - use the built-in i18n library
 * @return { string } i18n text
 * */
export const i18n = function (
    key,
    replaceObj = {},
    language = userLanguage,
    isUseBuildInLibrary = false
) {
    // Select table i18n according to the Use Building Library
    const i18nTable = isUseBuildInLibrary === true ? i18nBuildInObj: i18nObj;

    if (Object.keys(i18nTable).length === 0) {
        // get build in i18n library path
        const buildInI18nLibPath = fs.existsSync(path.resolve('./', 'node_modules/mbt_nodejs_i18n/i18n')) === true
            ? path.resolve('./', 'node_modules/mbt_nodejs_i18n/i18n')
            : path.resolve(child_process.execSync('npm config get prefix').toString(), 'node_modules/mbt_nodejs_i18n/i18n');

        // i18n init
        const i18nPath = isUseBuildInLibrary === true
            ? buildInI18nLibPath
            : path.resolve('./', 'i18n');
        i18nInit(i18nPath, i18nTable);
    }

    // Fielding test
    i18nGuard(key, language, i18nTable);

    // Text keyword replace and return
    return regReplace(i18nTable[language][key], replaceObj);
}

export default {
    i18nInit,
    i18n
}
