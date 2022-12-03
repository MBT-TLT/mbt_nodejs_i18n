# MBT_Nodejs_i18n
A lightweight Nodejs i18n plug-in developed by the MBT_TLT team

# Light
- Lightweight, this core of plug-in only about 18 kb
- supports interpolated text i18n
- You can actively reset i18n objects while the project running
- Global CLI command to quickly build the i18n base file

# Dev Log
- v1.0.0
    - Complete mbt_nodejs_i18n core development
- v1.0.1
    - Update related test code
- v1.0.2
    - Update CLI related features

# Feature
- Compatible with CommonJS
- Optimize the i18nInit logic to load and parse only the i18n files that make the fix

# Install
```shell
# use all functions of MBT_Nodejs_i18n
npm install -g mbt_nodejs_i18n
# just use core functions of MBT_Nodejs_i18n
npm install -s mbt_nodejs_i18n
```

# CLI Commands
When you install mbt_nodejs_i18n globally, you will be able to run the given instructions as mbt-i18n for CLI Controller:

## 1、create - Create i18n basic files
```shell
mbt-i18n create [folderPath] [languageArr...]
# folderPath      i18n filePath (default: `${ path.resolve('./') }`)
# languageArr     An array of target language flags to be translated (default: [`${ osLocaleSync() || 'en-US' }`]) osLocaleSync() is mean get os language
```
This directive will create an i18n folder and all i18n json files given by languageArr under the given folderPath (default is the current path).

If the folderPath tail path node is i18n, the i18n json file will be created directly under that path.

<span style="color: orange">[note: the tail node of a given folderPath path should ensure that it conforms to the npm package naming convention]</span>

The command will also run the following child commands:
- npm init -y `Execute this subinstruction only if package.json does not exist in a given path`
- npm install -s mbt_nodejs_i18n `Add mbt_nodejs_i18n to the running dependency of the project under the given path`

Example:
```shell
# 1. Create an i18n folder and related default i18n files under the current path (ignore if they exist)
# 2. Choose to execute 'npm init -y' based on whether there is a package.json file in the current path
# 3. Run 'npm install -s mbt_nodejs_i18n' to introduce the latest package of mbt_nodejs_i18n
mbt-i18n create

# 1. Create an i18n folder and related default i18n files under the 'F:/exampleI18n' folder (ignore if they exist)
# As above...
mbt-i18n create F:/exampleI18n

# 1. Create i18n folders and 'zh-CN.json' and 'en-US.json' i18n files under the 'F:/exampleI18n' folder (ignore if they exist)
# As above...
mbt-i18n create F:/exampleI18n zh-CN en-US
```


# Usage
## 0. import
You can choose to import and use MBT_Nodejs_i18n using the following methods

1.For ES6
```javascript
import i18n from 'mbt_nodejs_i18n'
```
or
```javascript
import { i18n } from 'mbt_nodejs_i18n'
```
2.For NodeJS

we're sorry, because MBT_Nodejs_i18n is developed using the ES module specification, and there is no compatibility with CommonJS for the time being,
So to use the plug-in, you need to name the JavaScript file suffix that imported the component .ejs, and then import and use it in the same way as ES6。

Or you can change your NodeJS to the ES module specification by adding the following configuration code to the package.json root node of your NodeJS project
<span style="color: red">[note: if your project was originally developed according to the CommonJS specification, this will lead to compatibility problems with your project!
]</span>
```text
"type": "module",
```

MBT_Nodejs_i18n provides two exposure methods, which are:
- `i18n` - i18n Core
- `i18nInit` - i18n Initialization function, pass in a path string that stores the i18n file of your project. If the i18n file is stored in the i18n folder under the project root directory, there is no need to call this function actively.

## 1. Initialization
MBT_Nodejs_i18n provides the i18nInit function, which is used to initialize or reset the i18n data information object for the plug-in, which is documented as:
```javascript
/**
 * i18nInit - Reinitialization is supported, the reinitialization content will overwrite the original i18nObj and i18nLanguageArr
 *
 * @export
 * @const
 * @function
 * @param { string } [i18nDirPath = path.resolve('./', 'i18n')] - i18n folder path
 * */
```
If the i18n related files of your project are stored in the i18n folder under the root of your project, there is no need to call this function actively. MBT_Nodejs_i18n has done everything for you. 😎

If your i18n-related files are not stored in the i18n folder in the root directory of your project, you need to actively call the i18nInit function before using i18n and pass in the storage path of your project i18n files, like this:
```javascript
// Suppose the i18n file is stored in the path 'D://i18n'
import { i18nInit } from 'mbt_nodejs_i18n';

// you code ...
i18nInit('D://i18n');
// you code ...
```

## 2. Simple text
For simple text, you can simply give the key of the text

Suppose the i18n related files like this:
```json
{
    "test": "this is a text"
}
```
Example:
```javascript
const a = i18n('test')

// will show "this is a text" in your console
console.log(a);
```


## 3. Interpolated text
For some complex scenes that need to be interpolated in the text, you only need to give an additional replacement object replaceObj on the basis of the key of the text,
and it should be noted that a given replaceObj must contain the same replaceKey index as text interpolation

Suppose the i18n related files like this:
```json
{
    "test": "this is a ${ a }"
}
```
Example:
```javascript
const b = i18n('test', {
    a: 'text'
});

// will show "this is a text" in your console
console.log(b);
```

## 4. Specify i18n language
Sometimes, we need to specify that the text output is in an i18n language, and all we need to do is to give its language identity.

Suppose there are two i18n related files, en-US.json and zh-CN.json like this:
```json
{
    "test": "this is a ${ a }"
}
```
```json
{
    "test": "这是一段${ a }"
}
```
Example:
```javascript
const c = i18n('test', {
    a: '文本'
}, 'zh-CN');

// will show "这是一段文本" in your console
console.log(c);
```

## 5. Reset i18n object
In addition to the initialization function mentioned above, the i18nInit function provided by MBT_Nodejs_i18n can also be used to reset i18n objects at any time.

Application scenarios:
- The i18n file in your i18n folder will change while the project running
- Your i18n folder will dynamically add or delete some i18n files while the project running

After the above scenario occurs, you can actively call the i18nInit function to reset the i18n object.

<span style="color: orange">[note: calling i18nInit will re-read and parse all i18n files under the given i18n folder, which is a performance-consuming process]</span>

---
<b>If you find any exception in use, please submit the Issues as soon as possible and describe in detail the conditions and usage scenarios of the exception. We will check and fix the relevant exception as soon as possible.</b>

<b style="color: green">If you think this plug-in is great, please give this project a Star. Everyone's support is the biggest driving force for our progress.😉</b>
