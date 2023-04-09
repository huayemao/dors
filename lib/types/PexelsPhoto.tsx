export type PexelsPhoto = {
  id: number;
  alt: string;
  src: {
    tiny: string;
    large: string;
    small: string;
    medium: string;
    large2x: string;
    original: string;
    portrait: string;
    landscape: string;
  };
  url: string;
  liked: boolean;
  width: number;
  height: number;
  avg_color: string;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
};
