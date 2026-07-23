import boothsJson from "../content/booths.json";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon?: string;
}

export interface Booth {
  id: string;
  mapId: string;
  name: LocalizedText;
  introduction: LocalizedText;
  details?: LocalizedText;
  links?: SocialLink[];
  image?: string;
  images?: string[];
}

export const booths = boothsJson as Booth[];
