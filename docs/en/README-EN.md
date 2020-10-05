# TextFrame

[中文版](https://github.com/mattuylee/text-frame) | [English](https://github.com/mattuylee/text-frame/docs/en/README-EN.md)

A javascript tool to split long text into frames, with typesetting prohibition processed and unicode full support.

## Introduction
It's difficute to compute how many characters a DOM element can show, because diffrent User Agents have diffrent typesetting rules. So for that, we have to draw text on a canvas with our own rules to know how to split text into several text frames, since we can compute character width through [CanvasRenderingContext2D.measureText()](https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D/measureText).

refering to [W3C draft](https://www.w3.org/TR/2020/WD-clreq-20201001/#prohibition_rules_for_line_start_end) for Chinese typesetting, following are my rules:

### Prohibition Rules for Line Start
|  Punctuation Name | The Punctuation Marks  |
| ---- | ------ |
|  Pause or Stop           |   、,，.．。:：;；!！?？  |
|  Closing Quotation        |  '"」』”’              |
| Closing Parentheses        | )]}）】〗〕］｝         |
| Closing Angle Brackets   | 》〉                   |
| Connectors         | –~～—                  |
| Interpuncts         | ·．‧•・                 |
| Solidi         | /／                    |

### Prohibition Rules for Line End
| Punctuation Name  |  The Punctuation Marks  |
| ---- | ------ |
| Opening Quotation        |  「『“‘                 |
| opening Parentheses        |  ([{（【〖〔［〔         |
| Opening Angle Brackets   | 《〈                    |
| Solidi         | /／                     |

### Prohibition Rules for Unbreakable Marks
|  Name  |  Mark  |
| ----  | ------ |
| Em dash and long dash | ──     |
| Ellipsis | ……     |

This library take the above as default rules, but it can be configued with [options](https://mattuylee.github.io/text-frame/en/options.md).

Here is an online [demo](https://mattuylee.github.io/text-frame/en/example.html).

## Usage
Browser environment is required, and [canvas support](https://caniuse.com/?search=canvas) is needed. This library CANNOT work under web worker.

### API
```typescript
// compute text frames
function computeTextFrames(options: FrameOptions): TextFrame[];
// render text frame
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
            text: "Caption"
        },
        {
            textIndent: 32,
            fontFamily: 'serif',
            margin: { bottom: 32 },
            marginCollapse: true,
            textAlign: 'justify',
            text: "This is a multi-line text. Pass your text paragraph as this."
        }
    ]
});
const canvas = document.createElement('canvas');
canvas.style.width = '320px';
canvas.style.height = '640px';
document.body.append(canvas);
renderFrame(canvas.getContext('2d'), frames[0], true);
```

### Globally Script
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
Option reference sits [here](https://mattuylee.github.io/text-frame/en/options.md).


## Build from Source
* clone the repo
`git clone https://github.com/mattuylee/text-frame.git`

* install dependences
`cd text-frame`  
`npm install`

### Distribution
`npm run dist`

### Start a demo serve
`npm run example`

### Debug
Run `npm run debug`, then open `example/index.html` in your browser, rollup will watch your code changes and automatically rebuild.

## Licence
MIT