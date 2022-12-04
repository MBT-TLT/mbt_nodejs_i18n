import fs from "fs";
import path from "path";
import child_process from "child_process";
import { i18n } from "../main.js";
import { osLocaleSync } from "os-locale";


/**
 * userLanguage
 *
 * @type String
 * */
const userLanguage = osLocaleSync() || 'en-US';

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
        }, userLanguage, true));

        const fileWS = fs.createWriteStream(languageFilePath);
        fileWS.write('{\r\n\t"key": "value"\r\n}\r\n');
        fileWS.end();

        console.log(i18n('createI18File-success', {
            language: language
        }, userLanguage, true));
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
 * @throws { RangeError } - throw when the projectName contains url-unfriendly characters
 * */
const i18nCreateCommand_guard = function (params) {
    // Determine whether folderPath exists, and if not, throw an error
    // params[0] - folderPath
    const hasFolder = fs.existsSync(path.resolve(params[0]));
    if (!hasFolder) {
        throw ReferenceError(i18n('ReferenceError-i18nCreateCommand_guard', {
            folderPath: params[0]
        }, userLanguage, true));
    }

    // determine whether there are url-unfriendly characters in projectName,
    // that is characters other than English characters, numbers, underline(_) and separator(-),
    // projectName - params[0]
    const folderName = path.parse(params[0]).name;
    const urlNotFriendlyReg = new RegExp(/[^0-9a-zA-Z\-_]+/);
    if (urlNotFriendlyReg.test(folderName)) {
        throw RangeError(i18n('RangeError-i18nCreateCommand_guard', {
            projectName: folderName,
            char: urlNotFriendlyReg.exec(folderName)[0]
        }, userLanguage, true));
    }
}

/**
 * i18nCreateCommand - create i18n folder command
 *
 * @export
 * @const
 * @function
 * @param { string } [folderPath = './'] - i18n folder path
 * @param { Array<string> } [languageArr = [osLocaleSync() || 'en-US']] - i18n language sign array
 * @param { Object } [extraParamObj = {}] - extra parameters
 * @param { Command } [triggerCommand = Command('create')] - trigger command object
 * */
export const i18nCreateCommand = function (
    folderPath,
    languageArr,
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
        }, userLanguage, true));

        process.exit();
    }

    try {
        // if package.json does not exist, run npm init-y under the given path
        if (!fs.existsSync(path.resolve(arguments[0], './package.json'))) {
            child_process.execSync(`cd ${ arguments[0] } & npm init -y`);
        }
        // add mbt_nodejs_i18n to the running dependency of the project under the current path
        child_process.execSync(`cd ${ arguments[0] } & npm install -s mbt_nodejs_i18n`);
    } catch (err) {
        // console fail
        console.log(i18n('i18nCreateCommand-failed', {
            folderPath: arguments[0],
            err: err.message
        }, userLanguage, true));

        process.exit();
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
    // arguments[1] - languageArr
    arguments[1].forEach((language) => {
        createI18File(i18nDirPath, language);
    });

    // console success, arguments[0] - folderPath
    console.log(i18n('i18nCreateCommand-success', {
        folderPath: arguments[0]
    }, userLanguage, true));
}

export default {
    i18nCreateCommand
}
