import fs from "fs";
import path from "path";
import child_process from "child_process";
import { i18n } from "../main.js";


/**
 * i18nInitCommand_unifiedParse - i18nInitCommand params unification
 *
 * @const
 * @function
 * @param { IArguments } params - params of i18nCreateCommand
 * @return { IArguments } - unified parse of i18nCreateCommand
 * */
const i18nInitCommand_unifiedParse = function (params) {
    // projectName converts uppercase characters to lowercase, and then replaces the original letter with - as a prefix,
    // projectName - params[0]
    const upperCaseReg = new RegExp(/[A-Z]+/g);

    // regular resolution
    const chipArr = [];
    let upperCaseRegExec;
    let chipIndex = 0;
    while (upperCaseRegExec = upperCaseReg.exec(params[0])) {
        const chipStr = upperCaseRegExec.input
            .substring(chipIndex, upperCaseRegExec.index);
        if (chipStr !== '') {
            chipArr.push(chipStr);
        }

        chipIndex = upperCaseRegExec.index;
    }
    chipArr.push(params[0].substring(chipIndex));

    // replace
    chipIndex = 0;
    for (let chipStr of chipArr) {
        // The first segment of uppercase character conversion does not add -
        if (chipIndex === 0) {
            chipArr[chipIndex] = /[A-Z]+/.test(chipStr[0]) ? `${ chipStr.toLowerCase() }`: chipStr;
        } else {
            chipArr[chipIndex] = /[A-Z]+/.test(chipStr[0]) ? `-${ chipStr.toLowerCase() }`: chipStr;
        }

        chipIndex++;
    }

    // unification projectName
    params[0] = chipArr.join('');

    return params;
}

/**
 * i18nInitCommand_guard - i18nInitCommand guard
 *
 * @const
 * @function
 * @param { IArguments } params - params of i18nCreateCommand
 * @throws { RangeError } - throw when the projectName contains url-unfriendly characters
 * @throws { ReferenceError } - throw if the projectName folder already exists under the current path and the folder is not empty
 * */
const i18nInitCommand_guard = function (params) {
    // determine whether there are url-unfriendly characters in projectName,
    // that is characters other than English characters, numbers, underline(_) and separator(-),
    // projectName - params[0]
    const urlNotFriendlyReg = new RegExp(/[^0-9a-zA-Z\-_]+/);
    if (urlNotFriendlyReg.test(params[0])) {
        throw RangeError(i18n('RangeError-i18nInitCommand_guard', {
            projectName: params[0],
            char: urlNotFriendlyReg.exec(params[0])[0]
        }));
    }

    // throw an error when the projectName folder already exists and is not empty,
    // params[0] - projectName
    const targetProjectPath = path.resolve('./', params[0]);
    const hasTargetLanguageFile = fs.existsSync(targetProjectPath);
    if (hasTargetLanguageFile) {
        const projectFileArr = fs.readdirSync(targetProjectPath);
        if (projectFileArr.length !== 0) {
            throw ReferenceError(i18n('ReferenceError-i18nInitCommand_guard', {
                projectName: params[0]
            }));
        }
    }
}

/**
 * i18nInitCommand - init i18n project
 *
 * @export
 * @const
 * @function
 * @param { string } projectName - i18n project name
 * @param { string } [targetLanguage = 'en-US'] - target language that needs to be translated
 * @param { Object } [extraParamObj = {}] - extra parameters
 * @param { Command } [triggerCommand = Command('create')] - trigger command object
 * */
export const i18nInitCommand = function (
    projectName,
    targetLanguage,
    extraParamObj,
    triggerCommand
) {
    // unification of params
    const unifiedParses = Array.from(i18nInitCommand_unifiedParse(arguments));
    Array.from(arguments).forEach((param, index) => {
        param = unifiedParses[index];
    });

    // function guard
    try {
        i18nInitCommand_guard(arguments);
    } catch (err) {
        // console fail, arguments[0] - projectName
        console.log(i18n('i18nInitCommand-failed', {
            projectName: arguments[0],
            err: err.message
        }));
        throw err;
    }

    // create the projectName folder when it does not already exist
    // arguments[0] - projectName
    const targetProjectPath = path.resolve('./', arguments[0]);
    const hasTargetLanguageFile = fs.existsSync(targetProjectPath);
    if (!hasTargetLanguageFile) {
        fs.mkdirSync(targetProjectPath);
    }

    // after moving to the projectName folder,
    // execute 'npm init -y', 'mbt-i18n create ./${ projectName }' and return to the root folder,
    // arguments[0] - projectName, arguments[1] - targetLanguage
    try {
        child_process.execSync(`cd ./${ arguments[0] } & npm init -y`);
        child_process.execSync(`mbt-i18n create ./${ arguments[0] } ${ arguments[1] } & cd ../`);
    } catch (err) {
        // console fail
        console.log(i18n('i18nInitCommand-failed', {
            projectName: arguments[0],
            err: err.message
        }));
        throw err;
    }

    // console success
    console.log(i18n('i18nInitCommand-success', {
        projectName: arguments[0]
    }));
}

export default {
    i18nInitCommand
}
