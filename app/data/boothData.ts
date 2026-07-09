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
  },
  {
    id: '5',
    name: { zh: '閃電特遣隊', en: 'Wonderbolt Runway' },
    description: {
      zh: '帥氣的痛包、胸章以及各式酷炫小馬主題刺繡布貼。',
      en: 'Cool Ita-bags, character badges, and custom pony-themed embroidery patches.',
    },
    links: [
      { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' }
    ]
  },
  {
    id: '6',
    name: { zh: '柔柔的避難所', en: "Fluttershy's Sanctuary" },
    description: {
      zh: '以植物與小動物為主題的精美徽章、手繪貼紙及環保布包。',
      en: 'Nature-inspired animal pins, hand-drawn stickers, and eco-friendly bags.',
    },
    links: [
      { label: 'Plurk', url: 'https://plurk.com', icon: 'fa-solid fa-paper-plane' }
    ]
  },
  {
    id: '7',
    name: { zh: '珍奇精品店', en: "Rarity's Boutique" },
    description: {
      zh: '高質感壓克力立牌、閃閃發光的吊飾以及精緻小馬卡貼。',
      en: 'High-quality acrylic standees, glitter keychains, and elegant card stickers.',
    },
    links: [
      { label: 'Website', url: 'https://twbronycon.org', icon: 'fa-solid fa-globe' }
    ]
  },
  {
    id: '8',
    name: { zh: '碧琪的派對列車', en: "Pinkie's Party Express" },
    description: {
      zh: '繽紛多彩的手作串珠手鍊、派對小帽以及熱情洋溢的周邊小禮品。',
      en: 'Colorful handmade beaded bracelets, party hats, and enthusiastic pony merch.',
    },
    links: [
      { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' }
    ]
  },
  {
    id: '9',
    name: { zh: '甜心寶寶烘焙坊', en: "Sweetie Belle's Bakery" },
    description: {
      zh: '精緻的手作小馬主題甜點貼紙、插畫卡片與甜美風掛飾。',
      en: 'Delicate handmade pony-themed dessert stickers, illustration cards, and sweet ornaments.',
    },
    links: [
      { label: 'Plurk', url: 'https://plurk.com', icon: 'fa-solid fa-paper-plane' }
    ]
  },
  {
    id: '10',
    name: { zh: '澤科拉的藥水鋪', en: "Zecora's Potions" },
    description: {
      zh: '神秘的手繪塔羅牌明信片、斑馬花紋特色掛件與魔法小藥瓶徽章。',
      en: 'Mysterious hand-drawn Tarot postcards, zebra-pattern charms, and magic potion badges.',
    },
    links: [
      { label: 'Website', url: 'https://twbronycon.org', icon: 'fa-solid fa-globe' }
    ]
  }
]