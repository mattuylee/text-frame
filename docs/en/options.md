# Options

## API Signature
```typescript
export function computeTextFrames(options: FrameOptions): TextFrame[];
export function renderFrame(context: CanvasRenderingContext2D, frame: TextFrame, clear: boolean): void;
```

## FrameOptions
### viewWidth
* Type: `number`
* Default: `300`
* Description: view width, must equal to canvas.style.width, but be numeric

### viewHeight
* Type: `number`
* Default: `150`
* Description: view height

### canvasWidth
* Type: `number`
* Default: compute with `viewWidth`
* Description: canvas.width，default is `viewWidth * window.devicePixelRatio`

### canvasHeight
* Type: `number`
* Default: compute with `viewHeight`
* Description: canvas.height is `viewHeight * window.devicePixelRatio`

### margin
* Type: `number | { left?: number, right?: number, top?: number, bottom?: number }`
* Default: `0`
* Description: margin for **frame**

### lineStartProhibitedMarks
* Type: `string`
* Default: `、,，.．。:：;；!！?？'"」』”’)]}）】〗〕］｝》〉–~～—·．‧•・/／`
* Description: prohibition characters for line start

### lineEndProhibitedMarks
* Type: `string`
* Default: `「『“‘([{（【〖〔［〔《〈/／`
* Description: prohibition characters for line end

### unbreakableRule
* Type: `RegExp`
* Default: `/──|……|[\w\d]+/`
* Description: unbreakable marks. If not empty, must be a RegExp instance. Marks match the rule will not be split into diffrent lines

### fragments
* Type: `FragmentOptions[]`
* Default: `null`
* Description: text fragments, typically one paragraph one fragment


## FrameOptions & FragmentOptions
Options for both frame and fragment. Fragment option will inhirit from frame option if it's empty except `margin`.

### fontFamily
* Type: `string`
* Default: `serif`
* Description: font family

### fontSize
* Type: `number`
* Default: `16`
* Description: font size

### fontWeight
* Type: `string | number`
* Default: `16`
* Description: font weight, refer CSS `font-weight`

### color
* Type: `string`
* Default: `#000000`
* Description: font color

### lineHeight
* Type: `number`
* Default: 1.5 * `fontSize`
* Description: line height

### textIndent
* Type: `number`
* Default: `0`
* Description: text indentation for first line of fragment. interal new line of a fragment is not processed

### textAlign
* Type: `'center' | 'start' | 'end' | 'left' | 'right' | 'justify'`
* Default: `start`
* Description: text alignment, refer CSS `text-align`

### textAlignLast
* Type: `'center' | 'start' | 'end' | 'left' | 'right' | 'justify'`
* Default: `start`
* Description: when `textAlign` is `justify`, how the last line is aligned. internal new line of a fragment is also processed. refer CSS `text-align-last`


### rtl
* Type: `boolean`
* Default: `false`
* Description: if true, draw text from right to left

### trim
* Type: `boolean`
* Default: `false`
* Description: if true, trim white characters of text of a fragment

### marginCollapse
* Type: `boolean`
* Default: `true`
* Description: if true, the margin-top a fragment is the max of its own and the previous one. if `marginCollapse` of the previous fragment is `false`, margin of current fragment will not collapse

### noHeadMargin
* Type: `boolean`
* Default: `false`
* Description: ignore margin-top if a fragment is on the top of a frame


## FragmentOptions
### margin
* Type: `number | { left?: number, right?: number, top?: number, bottom?: number }`
* Default: `0`
* Description: margin of a **fragment**

### text
* Type: `string`
* Default: `''`
* Description: text content of a fragment
