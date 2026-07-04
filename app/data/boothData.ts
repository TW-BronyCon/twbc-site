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
  rotate: number
  name: LocalizedText
  description: LocalizedText
  links?: SocialLink[]
  image?: string
}

export const booths: Booth[] = [
  {
    // A1 = booth label "1" in the detailed SVG floor plan
    id: 'A1',
    x: 107,
    y: 208,
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
    // A2 = booth label "2" in the detailed SVG floor plan
    id: 'A2',
    x: 126,
    y: 230,
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
    // A3 = booth label "3" in the detailed SVG floor plan
    id: 'A3',
    x: 154,
    y: 262,
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
    // A4 = booth label "4" in the detailed SVG floor plan
    id: 'A4',
    x: 173,
    y: 285,
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
    // B1 = booth label "6" in the detailed SVG floor plan (opposing row)
    id: 'B1',
    x: 168,
    y: 183,
    rotate: -36.62,
    name: { zh: '灰皮的小郵箱', en: "Derpy's Mailbox" },
    description: {
      zh: '經典馬芬造型徽章、明信片以及驚喜隨機貼紙包。',
      en: 'Classic muffin-themed badges, postcards, and mystery sticker packs.',
    },
    links: [
      { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' }
    ]
  },
  {
    // B2 = booth label "7" in the detailed SVG floor plan (opposing row)
    id: 'B2',
    x: 187,
    y: 206,
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
    // B3 = booth label "8" in the detailed SVG floor plan (opposing row)
    id: 'B3',
    x: 202,
    y: 162,
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
    // B4 = booth label "9" in the detailed SVG floor plan (opposing row)
    id: 'B4',
    x: 221,
    y: 184,
    rotate: -36.62,
    name: { zh: '碧琪的派對列車', en: "Pinkie's Party Express" },
    description: {
      zh: '繽紛多彩的手作串珠手鍊、派對小帽以及熱情洋溢的周邊小禮品。',
      en: 'Colorful handmade beaded bracelets, party hats, and energetic custom merchandise.',
    },
    links: [
      { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' }
    ]
  }
]
