# MBT_Nodejs_i18n
一款由 MBT_TLT 团队开发的轻量化 NodeJS i18n 插件

# 亮点
 - 轻量化, 该插件核心仅占约 18 kb
 - 支持插值文本的 i18n
 - 可在项目运行时主动重置 i18n 对象

# 未来计划
 - 兼容 CommonJS
 - 优化 i18nInit 相关逻辑, 使其仅加载并解析做出修复的 i18n 文件

# 安装
```shell
npm install -s mbt_nodejs_i18n
```

# 使用方法
## 0、导入
你可以选择使用以下方法导入并使用 MBT_Nodejs_i18n

1.对于 ES6 而言
```javascript
import i18n from '@mbt_tlt/mbt_nodejs_i18n'
```
或是
```javascript
import { i18n } from '@mbt_tlt/mbt_nodejs_i18n'
```
2.对于 NodeJS 而言

非常抱歉, 由于 MBT_Nodejs_i18n 采用 ES module 规范开发, 并且暂时没有提供对于 CommonJS 的相关兼容, 
所以若想要使用该插件, 你需要将导入该组件的 JavaScript 文件后缀命名为 .ejs, 然后使用与 ES6 一样的方式导入并使用。

或者可以在你 NodeJS 项目的 package.json 根节点中添加以下配置代码将你的 NodeJS 修改为 ES module 规范
<span style="color: red">【注意：若你的项目原先遵循 CommonJS 规范开发, 这将导致你的项目出现兼容性问题！】</span>
```text
"type": "module",
```

MBT_Nodejs_i18n 提供了两个暴露方法, 分别为: 
 - `i18n` - i18n 主函数
 - `i18nInit` - i18n 初始化函数, 传入一个存放你项目的 i18n 文件的路径字符串, 若 i18n 文件存放于项目根目录下的名为 i18n 文件夹中, 则无需主动调用该函数

## 1、初始化
MBT_Nodejs_i18n 提供了 i18nInit 函数, 其用于初始化或重置该插件的 i18n 数据信息对象, 该函数文档为:
```javascript
/**
 * i18nInit - 支持重新初始化，重新初始化的内容将覆盖原始的 i18nObj 和 i18nLanguageArr
 *
 * @export
 * @const
 * @function
 * @param { string } [i18nDirPath = path.resolve('./', 'i18n')] - i18n 文件夹路径, 默认为项目根目录的 i18n 文件夹
 * */
```
如果你项目的 i18n 相关文件存放于你项目根目录下的 i18n 文件夹中, 无需主动调用该函数, MBT_Nodejs_i18n 已经为你做好了一切 😎

如果你的 i18n 相关文件并不存放于你项目根目录下的 i18n 文件夹中, 则你需要在使用 i18n 前主动调用 i18nInit 函数并传入你项目 i18n 文件的存放路径, 就像这样:
```javascript
// 假设 i18n 文件存放于 'D://i18n' 这个路径下
import { i18nInit } from '@mbt_tlt/mbt_nodejs_i18n';

// you code ...
i18nInit('D://i18n');
// you code ...
```

## 2、简单的文本
对于简单的文本来说, 直接给定该文本的 key 即可

假设 i18n 相关文件中为:
```json
{
    "test": "this is a text"
}
```
示例：
```javascript
const a = i18n('test')

// will show "this is a text" in your console
console.log(a);
```


## 3、插值文本
对于一些需要在文本中进行插值的复杂场景, 只需要在给定该文本的 key 的基础上额外给定一个替换对象 replaceObj 即可, 
需要注意的是, 给定的 replaceObj 中必须包含与文本插值相同的 replaceKey 索引

假设 i18n 相关文件中为:
```json
{
    "test": "this is a ${ a }"
}
```
示例:
```javascript
const b = i18n('test', {
    a: 'text'
});

// will show "this is a text" in your console
console.log(b);
```

## 4、指定 i18n 语言
有些时候, 我们需要特别指定文本输出为某个 i18n 语言, 这时只需要给定其 language 标识即可

假设有 en-US.json 与 zh-CN.json 两个 i18n 相关文件
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
示例:
```javascript
const c = i18n('test', {
    a: '文本'
}, 'zh-CN');

// will show "这是一段文本" in your console
console.log(c);
```

## 5、重置 i18n 对象
MBT_Nodejs_i18n 所提供的 i18nInit 函数除了用于实现上文提到的初始化功能, 还可以用于随时重置 i18n 对象

应用场景: 
 - 假设你的 i18n 文件夹中的 i18n 文件会在项目运行时发生改变
 - 假设你的 i18n 文件夹会在运行过程中动态加入或删除一些 i18n 文件

那么以上场景发生后, 你可以主动调用 i18nInit 函数来重置 i18n 对象

<span style="color: orange">【注意：调用 i18nInit 将会重新读取并解析给定的 i18n 文件夹下的所有 i18n 文件, 这是一个很耗费性能的过程】</span>

---
<b>如果你在使用中发现了任何异常, 在此表示抱歉, 请你第一时间提交 Issues 并详细描述异常发生的条件与使用场景, 我们将尽快排查并修复相关异常</b>

<b style="color: green">如果你觉得这个插件很棒, 请给这个项目一个 Star, 大家的支持是我们进步的最大动力😉</b>
