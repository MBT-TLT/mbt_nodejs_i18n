import { osLocaleSync } from "os-locale";
import { unitTestSet } from "ks_unit_test_esm";
import { i18n } from "../main.js";
import { getTestData, getHaveTestSetLanguage } from "./testData.js";


/**
 * formatTestData - format test data
 *
 * @const
 * @function
 * @param { Array } oriData - Original test data
 * @return { Object } Test set object
 * */
const formatTestData = function (oriData) {
    const reObj = {
        testCaseNum: 0,
        haveTestSetLanguage: [],
        testList: [],
        resultList: []
    };

    // get test case num
    reObj.testCaseNum = oriData.length;

    // get testList and resultList
    oriData.forEach((testCaseItem) => {
        reObj.testList.push(testCaseItem.paramArr);
        reObj.resultList.push(testCaseItem.result);
    });

    return reObj;
}

/**
 * main - test main function
 *
 * @const
 * @function
 * */
const main = function () {
    const userOSLanguage = osLocaleSync();
    const testDataSet = formatTestData(getTestData(userOSLanguage || 'en-US'));
    const haveTestSetLanguageSet = new Set(getHaveTestSetLanguage());

    // Say hello
    console.log(i18n('testFunc-1'), '\n');

    // Say Sorry if there is no test set for the user's language
    if (!haveTestSetLanguageSet.has(userOSLanguage)) {
        console.log(i18n('testFunc-sorry', {
            language: userOSLanguage
        }), '\n');
    }

    // Show how many test cases are provided
    console.log(i18n('testFunc-2', {
        num: testDataSet.testCaseNum
    }), '\n');

    // Show test set
    console.log(i18n('testFunc-3', {
        testDataSet: JSON.stringify(testDataSet)
    }), '\n');

    // Show test result
    unitTestSet(i18n, testDataSet.testList, testDataSet.resultList);
}
main();
