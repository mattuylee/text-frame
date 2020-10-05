import { FrameOptions, TextFrame } from "./src/options";

export function computeTextFrames(options: FrameOptions): TextFrame[];
export function renderFrame(
  context: CanvasRenderingContext2D,
  frame: TextFrame,
  clear?: boolean
): void;
