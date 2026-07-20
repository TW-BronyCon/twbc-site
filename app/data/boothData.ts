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
  name: LocalizedText;
  description: LocalizedText;
  links?: SocialLink[];
  image?: string;
  images?: string[];
}

export const booths: Booth[] = [
  {
    id: "1",
    name: { zh: "青焰小馬布偶", en: "NKPLUSH" },
    description: {
      zh: "青焰的小馬布偶，還有雷曦文化的小馬毛絨週邊",
      en: "Plushies made by Neko and 雷曦（Reesee）'s plush merchandise.",
    },
    image: "/img/booths/booth-1-banner.webp",
    images: [
      "/img/booths/booth-1-banner.webp",
      "/img/booths/booth-1-avatar.webp",
    ],
    links: [
      {
        label: "Website",
        url: "https://www.nkplush.com/",
        icon: "fa-solid fa-globe",
      },
      {
        label: "X (Twitter)",
        url: "https://x.com/NKPlush",
        icon: "fa-brands fa-x-twitter",
      },
      {
        label: "Facebook",
        url: "https://www.facebook.com/NKPlush",
        icon: "fa-brands fa-facebook",
      },
    ],
  },
  {
    id: "2",
    name: { zh: "勉勉", en: "Mian Mian" },
    description: {
      zh: "台灣知名小馬繪師，厚塗風格，M6或主要角色吊飾、徽章、簽繪板、桌布、滑鼠墊等",
      en: "A famous Taiwanese MLP artist, thick-painting style, M6 or main character charms, badges, autograph boards, tablecloths, mousepads.",
    },
    image: "/img/booths/booth-2.webp",
    images: ["/img/booths/booth-2.webp"],
    links: [
      {
        label: "Website",
        url: "https://clair24552015.wixsite.com/mysite",
        icon: "fa-solid fa-globe",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/mian_mian1205/",
        icon: "fa-brands fa-instagram",
      },
      {
        label: "Facebook",
        url: "https://www.facebook.com/mian.mian.459393",
        icon: "fa-brands fa-facebook",
      },
      {
        label: "Youtube",
        url: "https://www.youtube.com/@Mianmian1205/videos",
        icon: "fa-brands fa-youtube",
      },
    ],
  },
  {
    id: "3",
    name: { zh: "藝潔的小木屋", en: "YeeJay's Art" },
    description: {
      zh: "徽章、毛巾、貼紙；M6、Q版、搖滾版",
      en: "Badges, towels, stickers; M6, chibi version, rock version.",
    },
    image: "/img/booths/booth-3.webp",
    images: ["/img/booths/booth-3.webp"],
    links: [
      {
        label: "Instagram",
        url: "https://www.instagram.com/yeejay14?igsh=dzYwb2VmZzF4Nmgw",
        icon: "fa-brands fa-instagram",
      },
    ],
  },
  {
    id: "4",
    name: { zh: "RavenWolf的書報攤", en: "RavenWolf's Newsstand" },
    description: {
      zh: "同人小說設定集、精美明信片與受小馬國歷史啟發的特色書籤。",
      en: "Fanfiction booklets, postcard sets, and bookmark collections inspired by Equestria.",
    },
    image: "/img/booths/booth-4.webp",
    images: ["/img/booths/booth-4.webp"],
    links: [
      {
        label: "DeviantArt",
        url: "https://www.deviantart.com/257ravenwolf/art/Stop-Bullying-MLP-and-Marvel-DD-crossover-727080061",
        icon: "fa-brands fa-deviantart",
      },
    ],
  },
  {
    id: "6",
    name: { zh: "雲港商行", en: "Cloud Harbor" },
    description: {
      zh: "雲港商行是以小馬主題收藏與精選周邊為主的期間限定攤位，提供角色玩偶、徽章、壓克力小物、書籍、拼圖、書籤、節慶裝飾與限定食品等商品，並依角色、狀態與數量整理，方便快速尋找收藏。\n商品以現場販售與取貨為主，多為少量現貨，部分品項僅有1件，售完不一定補貨；標示「已售出」或「待補貨」者目前無法購買，實際庫存以現場為準。\n攤位備有紫悅、雲寶、珍奇、蘋果嘉兒、柔柔、碧琪等角色收藏，適合補齊角色、尋找少見周邊，或帶一件可愛小物回家。",
      en: "Cloud Harbor is a limited-time booth focused on pony-themed collectibles and curated merchandise, including character plushies, badges, acrylic items, books, puzzles, bookmarks, seasonal decorations, and limited-edition snacks. Items are organized by character, condition, and quantity so visitors can quickly find the collectibles they want.\nSales and pickups are handled on site. Most items are limited in stock, and some are one-of-a-kind, so restocks are not guaranteed after they sell out. Items marked as sold out or pending restock are currently unavailable, and actual availability is subject to the booth's on-site inventory.\nThe booth features collectibles for characters such as Twilight Sparkle, Rainbow Dash, Rarity, Applejack, Fluttershy, and Pinkie Pie, making it a good place to complete a character collection, look for harder-to-find merchandise, or bring home a cute keepsake.",
    },
    image: "/img/booths/booth-5-banner.avif",
    images: [
      "/img/booths/booth-5-avatar.avif",
      "/img/booths/booth-5-banner.avif"
    ],
    links: [
      {
        label: "Website",
        url: "https://cloud-harbor.org",
        icon: "fa-solid fa-globe",
      },
    ],
  },
  // {
  //   id: '7',
  //   name: { zh: '官方攤位', en: "Official Booth" },
  //   description: {
  //     zh: '高質感壓克力立牌、閃閃發光的吊飾以及精緻小馬卡貼。',
  //     en: 'High-quality acrylic standees, glitter keychains, and elegant card stickers.',
  //   },
  //   links: [
  //     { label: 'Website', url: 'https://twbronycon.org', icon: 'fa-solid fa-globe' }
  //   ]
  // },
  // {
  //   id: '5',
  //   name: { zh: '柔柔的避難所', en: "Fluttershy's Sanctuary" },
  //   description: {
  //     zh: '以植物與小動物為主題的精美徽章、手繪貼紙及環保布包。',
  //     en: 'Nature-inspired animal pins, hand-drawn stickers, and eco-friendly bags.',
  //   },
  //   links: [
  //     { label: 'Plurk', url: 'https://plurk.com', icon: 'fa-solid fa-paper-plane' }
  //   ]
  // },
  // {
  //   id: '8',
  //   name: { zh: '碧琪的派對列車', en: "Pinkie's Party Express" },
  //   description: {
  //     zh: '繽紛多彩的手作串珠手鍊、派對小帽以及熱情洋溢的周邊小禮品。',
  //     en: 'Colorful handmade beaded bracelets, party hats, and enthusiastic pony merch.',
  //   },
  //   links: [
  //     { label: 'X (Twitter)', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' }
  //   ]
  // },
  // {
  //   id: '9',
  //   name: { zh: '甜心寶寶烘焙坊', en: "Sweetie Belle's Bakery" },
  //   description: {
  //     zh: '精緻的手作小馬主題甜點貼紙、插畫卡片與甜美風掛飾。',
  //     en: 'Delicate handmade pony-themed dessert stickers, illustration cards, and sweet ornaments.',
  //   },
  //   links: [
  //     { label: 'Plurk', url: 'https://plurk.com', icon: 'fa-solid fa-paper-plane' }
  //   ]
  // },
  // {
  //   id: '10',
  //   name: { zh: '澤科拉的藥水鋪', en: "Zecora's Potions" },
  //   description: {
  //     zh: '神秘的手繪塔羅牌明信片、斑馬花紋特色掛件與魔法小藥瓶徽章。',
  //     en: 'Mysterious hand-drawn Tarot postcards, zebra-pattern charms, and magic potion badges.',
  //   },
  //   links: [
  //     { label: 'Website', url: 'https://twbronycon.org', icon: 'fa-solid fa-globe' }
  //   ]
  // }
];
