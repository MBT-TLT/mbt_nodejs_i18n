import fs from "fs";
import path from "path";
import { i18n } from "../main.js";


/**
 * createI18File
 * 
 * @const
 * @function
 * @param { string } baseBath - i18n file path
 * @param { string } language - i18n language sign
 * */
const createI18File = function (baseBath, language) {
    const languageFilePath = path.resolve(baseBath, `./${ language }.json`);

    const hasTargetLanguageFile = fs.existsSync(languageFilePath);
    if (!hasTargetLanguageFile) {
        console.log(i18n('createI18File-1', {
            language: language
        }));

        const fileWS = fs.createWriteStream(languageFilePath);
        fileWS.write('{\r\n\t"key": "value"\r\n}\r\n');
        fileWS.end();

        console.log(i18n('createI18File-success', {
            language: language
        }));
    }
}

/**
 * i18nCreateCommand_unifiedParse - i18nCreateCommand params unification
 * 
 * @const
 * @function
 * @param { IArguments } params - params of i18nCreateCommand
 * @return { IArguments } - unified parse of i18nCreateCommand
 * */
const i18nCreateCommand_unifiedParse = function (params) {
    // check whether folderPath ends with i18n. If folderPath ends with i18n, delete first-level paths
    // params[0] - folderPath
    const folderPathParseObj = path.parse(path.resolve(params[0]));
    if (folderPathParseObj.name === 'i18n') {
        params[0] = folderPathParseObj.dir
    } else {
        // folderPath is converted to the absolute path format
        params[0] = path.resolve(params[0]);
    }

    return params;
}

/**
 * i18nCreateCommand_guard - i18nCreateCommand guard
 *
 * @const
 * @function
 * @param { IArguments } params - params of i18nCreateCommand
 * @throws { ReferenceError } - throw when the folderPath path does not exist
 * @throws { RangeError } - thrown when the given targetLanguage is consistent with ownLanguage
 * */
const i18nCreateCommand_guard = function (params) {
    // Determine whether folderPath exists, and if not, throw an error
    // params[0] - folderPath
    const hasFolder = fs.existsSync(path.resolve(params[0]));
    if (!hasFolder) {
        throw ReferenceError(i18n('ReferenceError-i18nCreateCommand_guard', {
            folderPath: params[0]
        }));
    }

    // Determine whether targetLanguage and ownLanguage are the same, and if so, throw a prompt
    // params[1] - targetLanguage, params[2] - ownLanguage
    if (params[1] === params[2]) {
        throw RangeError(i18n('RangeError-i18nCreateCommand_guard', {
            language: params[1]
        }));
    }
}

/**
 * i18nCreateCommand - create i18n folder command
 *
 * @export
 * @const
 * @function
 * @param { string } [folderPath = './'] - i18n folder path
 * @param { string } [targetLanguage = 'en-US'] - target language that needs to be translated
 * @param { string } [ownLanguage = osLocaleSync() || 'zh-CN'] - own Language
 * @param { Object } [extraParamObj = {}] - extra parameters
 * @param { Command } [triggerCommand = Command('create')] - trigger command object
 * */
export const i18nCreateCommand = function (
    folderPath,
    targetLanguage,
    ownLanguage,
    extraParamObj,
    triggerCommand
) {
    // unification of params
    const unifiedParses = Array.from(i18nCreateCommand_unifiedParse(arguments));
    Array.from(arguments).forEach((param, index) => {
        param = unifiedParses[index];
    });

    // function guard, arguments[0] - folderPath
    try {
        i18nCreateCommand_guard(arguments);
    } catch (err) {
        // console fail
        console.log(i18n('i18nCreateCommand-failed', {
            folderPath: arguments[0],
            err: err.message
        }));

        throw err;
    }

    // detects whether a folder named i18n exists on the given path,
    // and creates a folder if it does not exist, arguments[0] - folderPath
    const i18nDirPath = path.resolve(arguments[0], './i18n');
    const hasI18nDir = fs.existsSync(i18nDirPath);
    if (!hasI18nDir) {
        fs.mkdirSync(i18nDirPath);
    }

    // check whether the i18n json file corresponding to targetLanguage and ownLanguage exists
    // ignore if it exists, create if it doesn't,
    // arguments[1] - targetLanguage, arguments[2] - ownLanguage
    createI18File(i18nDirPath, arguments[1]);
    createI18File(i18nDirPath, arguments[2]);

    // console success, arguments[0] - folderPath
    console.log(i18n('i18nCreateCommand-success', {
        folderPath: arguments[0]
    }));
}

export default {
    i18nCreateCommand
}
