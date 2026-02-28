export type HeroWindowVariant = "light" | "pixel" | "dark";
export type HeroBreakpoint = "desktop" | "mobile";
export type HeroTextStyle =
  | "headline"
  | "pixelHeadline"
  | "pixelWord"
  | "darkHeadline";

export type HeroWindowPreset = {
  id: string;
  text?: string;
  textStyle?: HeroTextStyle;
  variant: HeroWindowVariant;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const heroWindowPresets: Record<HeroBreakpoint, HeroWindowPreset[]> = {
  desktop: [
    {
      id: "window-b",
      text: "We build",
      textStyle: "headline",
      variant: "light",
      x: 160,
      y: 170,
      width: 332,
      height: 174,
    },
    {
      id: "window-c",
      text: "the",
      textStyle: "pixelWord",
      variant: "pixel",
      x: 490,
      y: 90,
      width: 196,
      height: 254,
    },
    {
      id: "window-d",
      text: "models.",
      textStyle: "pixelHeadline",
      variant: "pixel",
      x: 605,
      y: 172,
      width: 336,
      height: 172,
    },
    {
      id: "window-h",
      text: "tware,",
      textStyle: "pixelWord",
      variant: "light",
      x: 792,
      y: 450,
      width: 292,
      height: 380,
    },
    {
      id: "window-f",
      text: "You build the future.",
      textStyle: "darkHeadline",
      variant: "dark",
      x: 880,
      y: 342,
      width: 820,
      height: 166,
    },
    {
      id: "window-g",
      text: "AI for Sof",
      textStyle: "pixelWord",
      variant: "light",
      x: 434,
      y: 557,
      width: 404,
      height: 166,
    },

    {
      id: "window-i",
      text: "redefined.",
      textStyle: "pixelHeadline",
      variant: "pixel",
      x: 1082,
      y: 508,
      width: 410,
      height: 162,
    },
  ],
  mobile: [
    {
      id: "window-b",
      text: "We build",
      textStyle: "headline",
      variant: "light",
      x: 10,
      y: 120,
      width: 224,
      height: 106,
    },
    {
      id: "window-c",
      text: "the",
      textStyle: "pixelWord",
      variant: "pixel",
      x: 64,
      y: 28,
      width: 116,
      height: 154,
    },
    {
      id: "window-d",
      text: "models.",
      textStyle: "pixelHeadline",
      variant: "pixel",
      x: 142,
      y: 116,
      width: 194,
      height: 112,
    },
    {
      id: "window-f",
      text: "You build the future.",
      textStyle: "darkHeadline",
      variant: "dark",
      x: 18,
      y: 300,
      width: 318,
      height: 102,
    },
    {
      id: "window-g",
      text: "AI for Sof",
      textStyle: "pixelWord",
      variant: "light",
      x: 10,
      y: 444,
      width: 204,
      height: 116,
    },
    {
      id: "window-h",
      text: "tware,",
      textStyle: "pixelWord",
      variant: "light",
      x: 118,
      y: 536,
      width: 162,
      height: 104,
    },
    {
      id: "window-i",
      text: "redefined.",
      textStyle: "pixelHeadline",
      variant: "pixel",
      x: 168,
      y: 622,
      width: 168,
      height: 118,
    },
  ],
};
