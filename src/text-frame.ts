import { TextFrame, FrameLine, FragmentOptions, Margin, FrameOptions, TextAlign, resolveOptions, resolveFragmentOptions } from "./options";
const ctx = document.createElement('canvas').getContext('2d');

export function computeTextFrames(options: FrameOptions) {
  const ops = resolveOptions(options || {} as any)
    , frames: TextFrame[] = []
    , frameMargin = ops.margin as Margin
    , maxFrameX = ops.canvasWidth - 1 - frameMargin.right
    , maxFrameY = ops.canvasHeight - 1 - frameMargin.bottom;
  let cursor = { x: 0, y: 0 }
    , textIndex = 0
    , maxLineX = 0
    , remainingMargin = 0
    , previousMarginCollapse = false
    , currFragment: FragmentOptions
    , currentText: string
    , currentLine: FrameLine
    , currentFrame: TextFrame;

  /**
   * get next char.
   * JavaScript encode string with UTF-16, where one unicode code point may be
   * encoded with two chars(such as emoji), so we need to deal with that case.
   * Refrence(English): @see https://en.wikipedia.org/wiki/UTF-16
   * Refrence(Chinese): @see https://zh.wikipedia.org/wiki/UTF-16
   */
  function nextChar() {
    if (!currentText) { return ''; }
    const codePoint = currentText.codePointAt(textIndex);
    if (codePoint === undefined) { return ''; }
    const charLen = String.fromCodePoint(codePoint).length;
    return currentText.slice(textIndex, textIndex + charLen);
  }

  // move cursor to a new frame
  function newFrame() {
    if (currentFrame) {
      finishFrame();
    }
    currentFrame = {
      options: ops,
      lines: []
    }
    currentLine = null;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    cursor = { x: frameMargin.left, y: frameMargin.top };
  };

  // move cursor to head of a new line
  function newLine() {
    const fragOps = currFragment;
    if (!currentFrame) { newFrame(); }
    finishLine();
    if (currentFrame.lines.length === 0) {
      // if there is no line in current frame, just start a new line without
      // checking available height, since a frame must be high enouth for one
      // line
      cursor = {
        x: frameMargin.left + fragOps.margin['left'],
        y: frameMargin.top
      }
    }
    else {
      // cursor.y are based on start of text box, but maxFrameY is max y which
      // the end of text box can reach, so we need to minus an extra lineHeight
      const availableHeight = maxFrameY - (cursor.y + fragOps.lineHeight);
      if (availableHeight < fragOps.lineHeight) {
        newFrame();
        // we don't plus the top margin of current fragment, because fragment
        // verticle margin should only be computed at the starting of fragment.
        cursor = {
          x: frameMargin.left + fragOps.margin['left'],
          y: frameMargin.top
        };
      }
      else {
        cursor.x = frameMargin.left + fragOps.margin['left'];
        cursor.y += fragOps.lineHeight;
      }
    }
    currentLine = {
      chars: [],
      isLastLine: false,
      fragmentOptions: fragOps,
      offset: { ...cursor },
    }
  };

  function finishLine() {
    if (currentLine) {
      // if a line exist currently, commit it
      currentFrame.lines.push(currentLine);
      currentLine = null;
    }
  }
  function finishLastLine() {
    if (currentLine) {
      currentLine.isLastLine = true;
    }
    finishLine();
  }

  // flush work on current frame
  function finishFrame() {
    if (currentFrame) {
      if (currentLine) { finishLine(); }
      frames.push(currentFrame);
      currentFrame = null;
    }
  }


  for (let fragOps of (ops.fragments || [])) {
    // flush work on previous fragment
    finishLastLine();
    fragOps = currFragment = resolveFragmentOptions(options, fragOps);
    ctx.font = fragOps.fontWeight + ' '
      + fragOps.fontSize + 'px '
      + fragOps.fontFamily;
    newLine();
    if (currentFrame.lines.length === 0) {
      // don't let new frame affected by remaining margin from previous frame
      remainingMargin = 0;
    }
    if (fragOps.marginCollapse && previousMarginCollapse) {
      remainingMargin = Math.max(fragOps.margin['top'], remainingMargin);
    }
    else {
      remainingMargin += fragOps.margin['top'];
    }
    if (currentFrame.lines.length > 0) {
      if (cursor.y + remainingMargin + fragOps.lineHeight > maxFrameY + 1) {
        // there is no enough space on current frame, get a new one
        currentLine = null;
        finishFrame();
        newLine();
      }
      else {
        cursor.y += remainingMargin;
      }
    }
    // not "else if". we check, or maybe re-check whether current frame is
    // empty, because current frame may be resetted above
    if (currentFrame.lines.length === 0 && !fragOps.noHeadMargin) {
      // current frame is empty, we don't create new frame anyway, so we can
      // skip checking space
      cursor.y = frameMargin.top + fragOps.margin['top'];
    }
    else {
      // if current frame is not empty, we have processed above; if
      // fragOps.noHeadMargin is true, the cursor is set correctly when we
      // create current frame. so there is nothing to do.
    }
    if (fragOps.textIndent > 0) {
      cursor.x += fragOps.textIndent;
    }
    // we moved cursor, and the slot of line start may have changed, reset it
    currentLine.offset.x = cursor.x;
    currentLine.offset.y = cursor.y;
    maxLineX = maxFrameX - fragOps.margin['right'];
    currentText = fragOps.text;
    textIndex = 0;

    while (textIndex < currentText.length) {
      let currentChar = nextChar()
        , currentCharLength = currentChar.length
        , currentCharWidth = ctx.measureText(currentChar).width
        , availableWidth = maxLineX + 1 - cursor.x;
      if (currentChar === '\n') {
        // current char is a carrige return, just move cusor to next line.
        // even if the last char of current line if a prohibition of line end,
        // we don't process it, since the paragraph has ended.
        finishLastLine();
        newLine();
        currentChar = null;
        currentCharWidth = 0;
        // we don't indent text since it's not the begining of a paragraph.
      }
      else if (availableWidth < currentCharWidth) {
        // there is no enough space to place current char, we need to turn to a
        // new line.
        // but before that, we have to process the prohibition of line start
        // and line end.
        let lineStartChar = currentChar, lineEndChar, newIndex = textIndex;
        for (let i = currentLine.chars.length - 1; i >= 0; --i) {
          lineEndChar = currentLine.chars[i];
          // we check whether there is a prohibition, if true, try to fix.
          // if a prohibition found, we try to fix it through moving the
          // line-end char of current line to the start of next line. then
          // check, repeat.
          // if we can't fix when current line has only one char left, just do
          // nothing as if there was no prohibition found.
          if (!ops.lineStartProhibitedMarks.includes(lineStartChar)
            && !ops.lineEndProhibitedMarks.includes(lineEndChar)
            && !ops.unbreakableRule.test(lineEndChar + lineStartChar)) {
            // fix
            currentChar = lineStartChar;
            currentCharLength = currentChar.length;
            currentCharWidth = ctx.measureText(currentChar).width;
            textIndex = newIndex;
            currentLine.chars = currentLine.chars.slice(0, i + 1);
            break;
          }
          newIndex -= lineStartChar.length;
          lineStartChar = lineEndChar;
        }
        newLine();
      }

      if (currentChar) {
        currentLine.chars.push(currentChar);
      }
      cursor.x += currentCharWidth;
      textIndex += currentCharLength;
    }
    remainingMargin = fragOps.margin['bottom'];
    previousMarginCollapse = fragOps.marginCollapse;
  }
  finishLastLine();
  finishFrame();
  return frames;
}


// prepare canvas to render text.
function prepareCanvas(
  context: CanvasRenderingContext2D,
  fragOptions: FragmentOptions,
  line: FrameLine) {
  const mergedOptions = fragOptions;
  if (mergedOptions) {
    context.font = mergedOptions.fontWeight + ' '
      + mergedOptions.fontSize + 'px '
      + mergedOptions.fontFamily;
    context.fillStyle = mergedOptions.color;
    // since context.direction is an experimental technology, we cannot rely on it
    context.direction = 'ltr';
    let textAlign = mergedOptions.textAlign;
    if (line.isLastLine && mergedOptions.textAlign === 'justify') {
      textAlign = mergedOptions.textAlignLast;
    }
    if (textAlign === 'start') {
      context.textAlign = mergedOptions.rtl ? 'right' : 'left';
    }
    else if (textAlign === 'end') {
      context.textAlign = mergedOptions.rtl ? 'left' : 'right';
    }
    else if (['center', 'left', 'right'].includes(textAlign)) {
      context.textAlign = textAlign as any;
    }
    else {
      context.textAlign = 'left';
    }
    context.textBaseline = 'middle';
  }
}

// finish work on current line
function renderLine(
  context: CanvasRenderingContext2D,
  options: FrameOptions,
  line: FrameLine) {
  if (line) {
    const fragOps = line.fragmentOptions
      , chars = fragOps.rtl
        ? line.chars.slice(0).reverse()
        : line.chars
      , frameMargin = options.margin as Margin
      , fragMargin = fragOps.margin as Margin;
    // draw text
    prepareCanvas(context, fragOps, line);
    let { x: offsetX, y: offsetY } = line.offset
      , isJustifyMode = fragOps.textAlign === TextAlign.justify
      , textIndent = offsetX - frameMargin.left - fragOps.margin['left'];
    // offsetY is based on top of text box, and context.textBaseline is
    // 'middle', so plus a half line height
    offsetY += fragOps.lineHeight / 2;
    if (isJustifyMode && line.isLastLine && fragOps.textAlignLast !== TextAlign.justify) {
      isJustifyMode = false;
    }
    if (isJustifyMode) {
      const contentWidth = context.measureText(chars.join('')).width
        , remainWidth = (options.canvasWidth - contentWidth
          - frameMargin.left - frameMargin.right - fragMargin.left
          - fragMargin.right - textIndent)
        , gap = remainWidth / (chars.length - 1);
      if (fragOps.rtl) {
        // initially, we assume using left-to-right mode, but it's right-to-left
        // mode now, we'll reverse the text and recompute offsetX, and we have
        // to "move" text indention to right
        offsetX -= textIndent;
      }
      for (let i = 0; i < chars.length; ++i) {
        context.fillText(chars[i], Math.round(offsetX), offsetY);
        offsetX += context.measureText(chars[i]).width + gap;
      }
    }
    else {
      // we use context.textAlign not fragOps.textAlign, because the first one
      // has been normalized when preparing canvas
      if (context.textAlign === 'center') {
        offsetX = context.canvas.width / 2;
      }
      else if (context.textAlign === 'right') {
        offsetX = (options.canvasWidth - frameMargin.right
          - fragOps.margin['right'] - textIndent);
      }
      context.fillText(chars.join(''), offsetX, offsetY);
    }
    line = null;
  }
}

export function renderFrame(context: CanvasRenderingContext2D, frame: TextFrame, clear?: boolean) {
  if (!context) {
    throw Error("error: text-frame - must provide drawing context!");
  }
  if (!frame) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    return;
  }
  const canvasWidth = Math.round(frame.options.canvasWidth)
    , canvasHeight = Math.round(frame.options.canvasHeight);
  if (clear
    || context.canvas.width !== canvasWidth
    || context.canvas.height !== canvasHeight) {
    context.canvas.width = canvasWidth
    context.canvas.height = canvasHeight
  }
  for (const line of frame.lines) {
    renderLine(context, frame.options, line);
  }
}
