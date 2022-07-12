export enum TextAlign {
  center = 'center',
  start = 'start',
  end = 'end',
  left = 'left',
  right = 'right',
  justify = 'justify'
}
export interface BaseOptions {
  color?: string
  rtl?: boolean
  trim?: boolean
  fontFamily?: string
  fontWeight?: string | number
  fontSize?: number
  lineHeight?: number
  textIndent?: number
  textAlign?: TextAlign | 'center' | 'start' | 'end' | 'left' | 'right' | 'justify'
  textAlignLast?: TextAlign | 'center' | 'start' | 'end' | 'left' | 'right' | 'justify'
  margin?: number | Margin
  marginCollapse?: boolean
  noHeadMargin?: boolean
}

export interface FragmentOptions extends BaseOptions {
  text: string
}

export interface Margin {
  left?: number
  right?: number
  top?: number
  bottom?: number
}

export interface FrameOptions extends BaseOptions {
  viewWidth?: number
  viewHeight?: number
  canvasHeight?: number
  canvasWidth?: number
  lineStartProhibitedMarks?: string
  lineEndProhibitedMarks?: string
  unbreakableRule?: RegExp
  fragments: FragmentOptions[]
}

export interface FrameLine {
  offset: { x: number, y: number }
  fragmentOptions: FragmentOptions
  isLastLine: boolean
  chars: string[]
}

export interface TextFrame {
  options: FrameOptions
  lines: FrameLine[]
}

const
  defaultOptionBase: BaseOptions = {
    color: '#000000',
    fontFamily: 'serif',
    fontWeight: 'normal',
    fontSize: 16,
    rtl: false,
    margin: 0,
    marginCollapse: true,
    noHeadMargin: false,
    textIndent: 0,
    textAlign: 'justify',
    textAlignLast: 'start'
  }
  , defaultOptions: FrameOptions = {
    ...defaultOptionBase,
    viewWidth: 300,
    viewHeight: 150,
    lineStartProhibitedMarks: `、,，.．。:：;；!！?？'"」』”’)]}）】〗〕］｝》〉–~～—·．‧•・/／ `,
    lineEndProhibitedMarks: `「『“‘([{（【〖〔［〔《〈/／`,
    unbreakableRule: /^(──|……|[\w\d]+)$/,
    fragments: null
  };

function resolveBaseOptions(options: BaseOptions) {
  // we don't cache devicePixelRatio globally, since it may change
  const dpi = devicePixelRatio || 1;
  const resolvedOptions: BaseOptions = {
    ...defaultOptionBase,
    ...(options || Object())
  };
  resolvedOptions.textIndent = (resolvedOptions.textIndent | 0) * dpi;
  if (resolvedOptions.fontSize > 0) {
    resolvedOptions.fontSize *= dpi;
  }
  else {
    resolvedOptions.fontSize = defaultOptions.fontSize * dpi;
  }
  if (resolvedOptions.lineHeight > 0) {
    resolvedOptions.lineHeight *= dpi;
  }
  else {
    resolvedOptions.lineHeight = resolvedOptions.fontSize * 1.5;
  }
  if (!(resolvedOptions.textAlign in TextAlign)) {
    resolvedOptions.textAlign = TextAlign.start;
  }
  if (typeof resolvedOptions.margin === 'object' && resolvedOptions !== null) {
    for (const s of ['left', 'right', 'top', 'bottom']) {
      resolvedOptions.margin[s] = (resolvedOptions.margin[s] | 0) * dpi;
    }
  }
  else {
    const margin = (resolvedOptions.margin as number | 0) * dpi;
    resolvedOptions.margin = {
      left: margin,
      right: margin,
      top: margin,
      bottom: margin
    };
  }
  return resolvedOptions;
}
export function resolveOptions(options: FrameOptions) {
  const dpi = devicePixelRatio
    , resolvedOptions: FrameOptions = {
      ...defaultOptions,
      ...resolveBaseOptions(options)
    };
  resolvedOptions.canvasWidth = options.canvasWidth || resolvedOptions.viewWidth * dpi;
  resolvedOptions.canvasHeight = options.canvasHeight || resolvedOptions.viewHeight * dpi;
  return resolvedOptions;
}
export function resolveFragmentOptions(slideOps: FrameOptions, fragOps: FragmentOptions) {
  // margin is not inherited from frame options
  const { margin: _, ...fallback } = slideOps;
  // for ignored config, fallback to global option, then fallback to default option
  let resolvedOptions: FragmentOptions = { ...fallback, ...fragOps };
  resolvedOptions.text = resolvedOptions.text || '';
  resolvedOptions.text =
    resolvedOptions.text.replace('\r\n', '\n').replace('\r', '\n');
  resolvedOptions = resolveBaseOptions(resolvedOptions) as FragmentOptions;
  if (resolvedOptions.trim) {
    resolvedOptions.text = resolvedOptions.text.trim();
  }
  return resolvedOptions;
}
