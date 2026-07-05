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
  x: number
  y: number
  w?: number
  h?: number
  rotate: number
  name: LocalizedText
  description: LocalizedText
  links?: SocialLink[]
  image?: string
}

export const booths: Booth[] = [
  {
    id: '1',
    x: 107.56,
    y: 260.74,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
    name: { zh: '小馬郵局', en: "Derpy's Mailbox" },
    description: {
      zh: '經典馬芬造型徽章、明信片以及驚喜隨機貼紙包。',
      en: 'Classic muffin-themed badges, postcards, and mystery sticker packs.',
    },
    links: [
      { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' }
    ]
  },
  {
    id: '2',
    x: 125.97,
    y: 285.52,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
    name: { zh: '彩虹畫筆', en: 'Rainbow Brush' },
    description: {
      zh: '專售各式手工小馬鑰匙圈、精美貼紙及同人原創插畫海報。',
      en: 'Handmade keychains, beautiful stickers, and original fan art posters.',
    },
    links: [
      { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' },
      { label: 'Website', url: 'https://twbronycon.org', icon: 'fa-solid fa-globe' }
    ]
  },
  {
    id: '3',
    x: 152.03,
    y: 320.59,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
    name: { zh: '甜蘋果工坊', en: 'Apple Orchard Crafts' },
    description: {
      zh: '充滿愛心的手工手提袋、角色絨毛布偶以及精緻小馬布藝配件。',
      en: 'Lovely handmade tote bags, character plushies, and delicate fabric accessories.',
    },
    links: [
      { label: 'Plurk', url: 'https://plurk.com', icon: 'fa-solid fa-paper-plane' }
    ]
  },
  {
    id: '4',
    x: 170.44,
    y: 345.37,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
    name: { zh: '暮光圖書館', en: "Twilight's Library" },
    description: {
      zh: '同人小說設定集、精美明信片與受小馬國歷史啟發的特色書籤。',
      en: 'Fanfiction booklets, postcard sets, and bookmark collections inspired by Equestria.',
    },
    links: [
      { label: 'Website', url: 'https://twbronycon.org', icon: 'fa-solid fa-globe' }
    ]
  },
  {
    id: '5',
    x: 196.5,
    y: 380.44,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
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
    x: 165.16,
    y: 233.38,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
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
    x: 183.57,
    y: 258.17,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
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
    x: 196.95,
    y: 209.75,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
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
    x: 215.37,
    y: 234.53,
    w: 18.68,
    h: 15.44,
    rotate: -36.62,
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
    x: 212.86,
    y: 264.25,
    w: 15.44,
    h: 18.68,
    rotate: -36.62,
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
