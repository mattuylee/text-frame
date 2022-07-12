# 配置项

## 导出函数原型
```typescript
export function computeTextFrames(options: FrameOptions): TextFrame[];
export function renderFrame(context: CanvasRenderingContext2D, frame: TextFrame): void;
```

## FrameOptions
### viewWidth
* 类型: `number`
* 默认值: `300`
* 说明: 指定视图宽度，用于计算`canvasWidth`。除非显式提供`canvasWidth`参数，否则必须提供此参数。`viewWidth`应与要实际绘制文本的canvas的css宽度相等。

### viewHeight
* 类型: `number`
* 默认值: `150`
* 说明:指定视图高度。

### canvasWidth
* 类型: `number`
* 默认值: 根据`viewWidth`计算。
* 说明: canvas画布宽度，对应canvas.width，默认为`viewWidth * window.devicePixelRatio`。

### canvasHeight
* 类型: `number`
* 默认值: 根据`viewHeight`计算。
* 说明: canvas画布高度，对应canvas.height。

### margin
* 类型: `number | { left?: number, right?: number, top?: number, bottom?: number }`
* 默认值: `0`
* 说明: 每个分页（frame）的边距。注意，虽然`FragmentOptions`也有margin配置项，但二者并不是继承关系，而是作用于不同的对象：页面（frame）和文本段落（fragment）。

### lineStartProhibitedMarks
* 类型: `string`
* 默认值: `、,，.．。:：;；!！?？'"」』”’)]}）】〗〕］｝》〉–~～—·．‧•・/／ `
* 说明: 禁止出现在行首的字符。

### lineEndProhibitedMarks
* 类型: `string`
* 默认值: `「『“‘([{（【〖〔［〔《〈/／`
* 说明: 禁止出现在行尾的字符。

### unbreakableRule
* 类型: `RegExp`
* 默认值: `/^(──|……|[\w\d]+)$/`
* 说明: 符号分离禁则规则。如果提供，必须为正则表达式，正则表达式匹配则该认为该组合不能被拆分到新行，默认为破折号，省略号，和英文字母、数字组合。

### fragments
* 类型: `FragmentOptions[]`
* 默认值: `null`
* 说明: 文本段落数组。必须提供此参数。


## FrameOptions & FragmentOptions
以下配置项既可以在`FrameOptions`中指定，也可以在`FragmentOptions`中指定。当`FragmentOptions`未指定相关参数时，将继承`FrameOptions`的配置（再次强调，`margin`并不会继承）。

### fontFamily
* 类型: `string`
* 默认值: `serif`
* 说明: 字体名称。

### fontSize
* 类型: `number`
* 默认值: `16`
* 说明: 字体大小。

### fontWeight
* 类型: `string | number`
* 默认值: `16`
* 说明: 字体粗细。参考CSS `font-weight`。

### color
* 类型: `string`
* 默认值: `#000000`
* 说明: 字体颜色。

### lineHeight
* 类型: `number`
* 默认值: 1.5倍`fontSize`
* 说明: 行高。

### textIndent
* 类型: `number`
* 默认值: `0`
* 说明: 首行缩进。注意，对于每一个文本段落，仅首行缩进，即使文本段落中有换行符，新行也不会缩进。参考word中的软回车。若要分段落应提供多个文本段落。

### textAlign
* 类型: `'center' | 'start' | 'end' | 'left' | 'right' | 'justify'`
* 默认值: `start`
* 说明: 文本对齐方式。参考CSS `text-align`。

### textAlignLast
* 类型: `'center' | 'start' | 'end' | 'left' | 'right' | 'justify'`
* 默认值: `start`
* 说明: 当`textAlign`为`justify`时（两端对齐），段落最后一行的对齐方式。注意，这里的最后一行包括文本片段内部的换行符前的最后一行。参考CSS `text-align-last`。

### rtl
* 类型: `boolean`
* 默认值: `false`
* 说明: 是否从右到左渲染。

### trim
* 类型: `boolean`
* 默认值: `false`
* 说明: 是否自动删除文本片段首尾的空白符。注意，文本片段内部换行后行首尾空白符不会被清除。

### marginCollapse
* 类型: `boolean`
* 默认值: `true`
* 说明: 文本片段的上边距是否与前一文本片段的下边距折叠。注意，如果相邻的任一文本片段`marginCollapse`为false，则不会发生边距折叠。

### noHeadMargin
* 类型: `boolean`
* 默认值: `false`
* 说明: 当一个文本片段正好开始于一个空的页面时，是否忽略其上边距。


## FragmentOptions
### margin
* 类型: `number | { left?: number, right?: number, top?: number, bottom?: number }`
* 默认值: `0`
* 说明: 文本片段的边距。注意，此配置项不继承于`FrameOptions`的`margin`选项。

### text
* 类型: `string`
* 默认值: `''`
* 说明: 该文本段落要绘制的文本内容。
