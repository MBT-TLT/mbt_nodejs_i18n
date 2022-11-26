/**
 * testData - Test data object
 *
 * @type { Object }
 * */
export const testData = {
    'zh-CN': [
        {
            paramArr: [
                'test-1'
            ],
            result: '这是一段测试文本'
        },
        {
            paramArr: [
                'test-2',
                {
                    key: 'keyword'
                }
            ],
            result: '这是一段带有 keyword 的测试文本'
        },
        {
            paramArr: [
                'test-1',
                {},
                'en-US'
            ],
            result: 'This is a test text'
        },
        {
            paramArr: [
                'test-2',
                {
                    key: 'keyword'
                },
                'en-US'
            ],
            result: 'This is a piece of test text with keyword'
        },
    ],
    'en-US': [
        {
            paramArr: [
                'test-1'
            ],
            result: 'This is a test text'
        },
        {
            paramArr: [
                'test-2',
                {
                    key: 'keyword'
                }
            ],
            result: 'This is a piece of test text with keyword'
        },
        {
            paramArr: [
                'test-1',
                {},
                'zh-CN'
            ],
            result: '这是一段测试文本'
        },
        {
            paramArr: [
                'test-2',
                {
                    key: 'keyword'
                },
                'zh-CN'
            ],
            result: '这是一段带有 keyword 的测试文本'
        },
    ]
};

/**
 * getTestData - Get test data
 *
 * @const
 * @function
 * @param { string } language - Language sign
 * @return { Array<Object> } Test data for the corresponding language
 * */
export const getTestData = function (language) {
    return testData[language];
}

/**
 * getHaveTestSetLanguage - get the existing test set language
 *
 * @export
 * @const
 * @return { Array<string> } existing test set languages array
 * */
export const getHaveTestSetLanguage = function () {
    return Object.keys(testData);
}

export default {
    getTestData,
    getHaveTestSetLanguage
};