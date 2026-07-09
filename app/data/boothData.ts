export interface LocalizedText {
  zh: string
  en: string
}

export interface SocialLink {
  label: string
  url: string
  icon?: string
}

export interface Booth {
  id: string
  name: LocalizedText
  description: LocalizedText
  links?: SocialLink[]
  image?: string
}

export const booths: Booth[] = [
  {
    id: '1',
    name: { zh: '青焰小馬布偶', en: "NKPLUSH" },
    description: {
      zh: '青焰的小馬布偶，還有雷曦文化的小馬毛絨週邊',
      en: 'Plushies made by Neko and 雷曦（Reesee）\'s plush merchandise.',
    },
    links: [
      { label: 'Website', url: 'https://www.nkplush.com/', icon: 'fa-solid fa-globe' },
      { label: 'X (Twitter)', url: 'https://x.com/NKPlush', icon: 'fa-brands fa-x-twitter' },
      { label: 'Facebook', url: 'https://www.facebook.com/NKPlush', icon: 'fa-brands fa-facebook' }
    ]
  },
  {
    id: '2',
    name: { zh: '勉勉', en: 'Mian Mian' },
    description: {
      zh: '台灣知名小馬繪師，厚塗風格，M6或主要角色吊飾、徽章、簽繪板、桌布、滑鼠墊等',
      en: 'A famous Taiwanese MLP artist, thick-painting style, M6 or main character charms, badges, autograph boards, tablecloths, mousepads.',
    },
    links: [
      { label: 'Website', url: 'https://clair24552015.wixsite.com/mysite', icon: 'fa-solid fa-globe' },
      { label: 'Instagram', url: 'https://www.instagram.com/mian_mian1205/', icon: 'fa-brands fa-instagram' },
      { label: 'Facebook', url: 'https://www.facebook.com/mian.mian.459393', icon: 'fa-brands fa-facebook' },
      { label: 'Youtube', url: 'https://www.youtube.com/@Mianmian1205/videos', icon: 'fa-brands fa-youtube' }
    ]
  },
  {
    id: '3',
    name: { zh: '藝潔的小木屋', en: 'YeeJay\'s Art'},
    description: {
      zh: '徽章、毛巾、貼紙；M6、Q版、搖滾版',
      en: 'Badges, towels, stickers; M6, chibi version, rock version.',
    },
    links: [
      { label: 'Instagram', url: 'https://www.instagram.com/yeejay14?igsh=dzYwb2VmZzF4Nmgw', icon: 'fa-brands fa-instagram' }
    ]
  },
  {
    id: '4',
    name: { zh: 'RavenWolf的書報攤', en: "RavenWolf's Newsstand" },
    description: {
      zh: '同人小說設定集、精美明信片與受小馬國歷史啟發的特色書籤。',
      en: 'Fanfiction booklets, postcard sets, and bookmark collections inspired by Equestria.',
    },
    links: [
      { label: 'DeviantArt', url: 'https://www.deviantart.com/257ravenwolf/art/Stop-Bullying-MLP-and-Marvel-DD-crossover-727080061', icon: 'fa-brands fa-deviantart' }
    ]
  }
]