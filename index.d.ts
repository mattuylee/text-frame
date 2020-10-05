import { FrameOptions, FragmentOptions, TextFrame } from "./src/options";

export as namespace TextFrame;

export function computeTextFrames(options: FrameOptions): TextFrame[];
export function renderFrame(
  context: CanvasRenderingContext2D,
  frame: TextFrame,
  clear?: boolean
): void;

export {
  FrameOptions,
  FragmentOptions,
  TextFrame
}