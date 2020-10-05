# TextFrame
一个通过canvas将长文本分成若干页渲染的js工具，处理排版禁则，支持辅助平面Unicode字符。目前仅工作于浏览器环境。

[中文版](https://github.com/mattuylee/text-frame) | [English](https://github.com/mattuylee/text-frame/blob/master/docs/en/README-EN.md)

## 项目介绍
在浏览器中，尽管css有分栏布局，但却很难实现“分页”。浏览器没有提供计算一个盒子可以显示多少文本的API，只有Canvas的上下文提供了一个`measureText()`方法，但它只能简单的计算一段文本的渲染宽度，当文本不止一行时就无法计算了。由于不同字体不同字符有不同的宽度，再加上各浏览器对排版禁则的处理不一致，基本杜绝了计算浏览器原生DOM元素能够显示多少文本的可能。

于是我参考W3C对中文排版的[草案](https://www.w3.org/TR/2020/WD-clreq-20201001/#prohibition_rules_for_line_start_end)中的排版禁则，通过[CanvasRenderingContext2D.measureText()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/measureText)方法计算字符宽度，对文本进行分页。

### 行首禁则
|  名称 |  符号  |
| ---- | ------ |
| 点号           |   、,，.．。:：;；!！?？  |
| 结束引号        |  '"」』”’              |
| 结束括号        | )]}）】〗〕］｝         |
| 结束乙式书名号   | 》〉                   |
| 连接号         | –~～—                  |
| 间隔号         | ·．‧•・                 |
| 分隔号         | /／                    |

### 行尾禁则
|  名称 |  符号  |
| ---- | ------ |
| 开始引号        |  「『“‘                 |
| 开始括号        |  ([{（【〖〔［〔         |
| 开始单双书名号   | 《〈                    |
| 分隔号         | /／                     |

### 符号分离禁则
|  名称  |  符号  |
| ----  | ------ |
| 破折号 | ──     |
| 省略号 | ……     |

本项目默认按照上述禁则处理排版禁则，但可以通过[选项](https://github.com/mattuylee/text-frame/blob/master/docs/zh/options.md)控制排版禁则。
草案中规定，当碰到行首为（行首禁则中的）标点时，应遵守「先挤进，后推出」原则，即先尝试压缩当前行的标点，无法挤压再取前一行的最后一个字至下一行。考虑到标点符号压缩的复杂性，本项目暂未实现该特性，而是直接尝试取上一行的最后一字到下一行，如果直到上一行首都没找到允许出现在行首的字符，则采取不处理的方式。

## 功能
本项目定义了文本片段（text fragment）的概念。通过在选项中指定一个文本片段数组，可以对每一个片段设置不同的样式，如字体、颜色、对齐方式等，具体请参考[配置项](https://github.com/mattuylee/text-frame/blob/master/docs/zh/options.md)。一般来说，一个文本片段即一个文本段落，虽然文本片段内也支持换行，但不会有段间距和行缩进。在本项目文档中文本片段和文本段落等价，都是指`FragmentOptions`定义的文本片段。

本项目支持以下特性：
* 每个段落单独设置字体、缩进、边距、字体颜色等；
* 支持两端对齐；
* 支持自定义排版禁则；
* 可配置段落之间边距是否折叠；
* 支持rtl模式；

这是一个[在线例子](https://mattuylee.github.io/text-frame/zh/example.html)。

## 使用
本项目仅支持浏览器环境，且依赖于Canvas 2D上下文，请参考[canvas兼容性](https://caniuse.com/?search=canvas)。

### API
```typescript
// 计算分页
function computeTextFrames(options: FrameOptions): TextFrame[];
// 渲染分页到canvas
function renderFrame(context: CanvasRenderingContext2D, frame: TextFrame, clear: boolean): void;
```

### npm
`npm install @mattuy/text-frame --save`
### ES2015 & CommonJS
```javascript
// cjs
// const { computeTextFrames, renderFrame } = require('@mattuy/text-frame');
// or esm
import { computeTextFrames, renderFrame } from '@mattuy/text-frame/esm';

const frames = computeTextFrames({
    viewWidth: 320,
    viewHeight: 640,
    fontSize: 16,
    margin: 8,
    color: '#000',
    fragments: [
        {
            color: 'green',
            fontSize: 20,
            margin: 32,
            textAlign: 'center',
            text: "标题"
        },
        {
            textIndent: 32,
            fontFamily: 'serif',
            margin: { bottom: 32 },
            marginCollapse: true,
            textAlign: 'justify',
            text: "这是一个多行文本。"
        }
    ]
});
const canvas = document.createElement('canvas');
canvas.style.width = '320px';
canvas.style.height = '640px';
document.body.append(canvas);
renderFrame(canvas.getContext('2d'), frames[0]);
```

### 全局引入
```html
<script src="text-frame/dist/umd/text-frame-min.js"></script>
<script>
    const frames = TextFrame.computeTextFrames({
        // ...options
    });
    console.log(frames)
    // ...render
</script>
```

配置说明请参考[配置项](https://github.com/mattuylee/text-frame/blob/master/docs/zh/options.md)。


## 源码编译
* 克隆仓库
`git clone https://github.com/mattuylee/text-frame.git`

* 安装依赖
`cd text-frame`  
`npm install`

### 发布
`npm run dist`

### 启动demo
`npm run example`

### 调试代码
执行`npm run debug`，然后rollup会监听src下文件的变化自动重新编译。可浏览器直接打开`example/index.html`测试。


## Licence
MIT