export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16'
}

export enum Resolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K'
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  referenceImage?: string; // base64 string
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}