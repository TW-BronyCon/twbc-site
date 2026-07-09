export type EventType =
  | "entry"
  | "opening"
  | "community"
  | "break"
  | "talk"
  | "music"
  | "sing"
  | "photo"
  | "workshop"
  | "vendor"
  | "social"
  | "social-special";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Column {
  key: string;
  label?: LocalizedText;
  min: string;
  grow?: number;
  color?: string;
}

export interface TimetableEvent {
  title: LocalizedText;
  track: string;
  start: string;
  end: string;
  type: EventType;
  detail?: LocalizedText;
  vertical?: boolean;
  PointerEvent?: boolean;
}

export const EVENT_COLORS: Record<EventType, string> = {
  entry: "#ececec",
  opening: "#d7d8f3",
  community: "#ee7ab0",
  break: "#c7c6df",
  talk: "#efd992",
  music: "#175b9f",
  sing: "#235cc9",
  photo: "#d9ebf5",
  workshop: "#ffaa82",
  vendor: "#d6aa03",
  social: "#81fff9",
  "social-special": "#149be6",
};

export const startHour = 9;
export const endHour = 21.5;
export const slotMinutes = 5;

export const columns: Column[] = [
  { key: "time-left", min: "5em" },
  {
    key: "main",
    label: { zh: "主舞台", en: "Main Stage" },
    min: "10em",
    grow: 1.25,
    color: "#efefef",
  },
  {
    key: "workshop",
    label: { zh: "工坊區", en: "Workshop" },
    min: "7em",
    grow: 1,
    color: "#efefef",
  },
  {
    key: "vendor",
    label: { zh: "攤位街", en: "Vendor Alley" },
    min: "6.5em",
    grow: 1,
    color: "#efefef",
  },
  {
    key: "social",
    label: { zh: "交誼區", en: "Social Area" },
    min: "7.5em",
    grow: 1.05,
    color: "#efefef",
  },
  { key: "time-right", min: "5em" },
];

export const events: TimetableEvent[] = [
  {
    title: { zh: "進場", en: "Entry" },
    track: "main",
    start: "09:30",
    end: "10:00",
    type: "entry",
    detail: {
      zh: "開放入場與自由交流時間，可以先熟悉場地、攤位位置，和其他小馬迷打招呼。",
      en: "Entry and free social time. Get familiar with the venue and vendor area, and say hello to fellow pony fans.",
    },
  },
  {
    title: { zh: "開場介紹", en: "Opening" },
    track: "main",
    start: "10:00",
    end: "10:30",
    type: "opening",
    detail: {
      zh: "活動正式開始，介紹本日流程、活動區域、注意事項，以及各項精彩內容。",
      en: "The event officially begins with an introduction to the schedule, areas, rules, and highlights of the day.",
    },
  },
  {
    title: { zh: "瘋狂小馬故事", en: "Crazy Pony Stories" },
    track: "main",
    start: "10:45",
    end: "11:45",
    type: "community",
    detail: {
      zh: "來玩瘋狂填詞吧！這是一款特別的故事填空遊戲，所有故事都以小馬為主題。\n究竟大家能填出一篇爆笑故事，還是創造出一場離譜的事故呢？",
      en: "Lets play Mad Libs! This is a unique fill-in-the-blank story game, and all the stories are pony-themed. \nWill we end up with a hilarious story, or will we create an absolute disaster?",
    },
  },
  {
    title: {
      zh: "休息時間(影片欣賞)\nA Decade of Pony",
      en: "Break / Screening\nA Decade of Pony",
    },
    track: "main",
    start: "12:00",
    end: "13:00",
    type: "break",
    detail: {
      zh: "午間休息時段，現場將播放《A Decade of Pony》，一起回顧十年來的小馬旅程與社群記憶。",
      en: "During the noon break, A Decade of Pony will be screened as we look back on years of pony memories.",
    },
  },
  {
    title: { zh: "專題分享\n青焰布偶", en: "Featured Talk\nQingyan Plush" },
    track: "main",
    start: "13:00",
    end: "14:00",
    type: "talk",
    detail: {
      zh: "馬圈知名布偶師青焰將進行專題演講，分享小馬布偶的製作過程以及布偶商業化歷程。",
      en: "Neko Kevin Plushie, a famous pony plushie creator in Taiwan, will give a keynote speech, sharing the production process of pony plushies and the history of their commercialization.",
    },
  },
  {
    title: { zh: "劇照大挑戰", en: "Pony Still Challenge" },
    track: "main",
    start: "14:15",
    end: "15:15",
    type: "community",
    detail: {
      zh: "桃漪考考你有沒有認真觀看關於她來自的世界的動畫，你能否根據一張畫面就能猜出是MLP中哪一集嗎?",
      en: "Peach Ripple wants to test your knowledge of the world where she came from! Can you guess the episode just by looking at a single screenshot?",
    },
  },
  //{
  //  title: { zh: '小馬知識大挑戰', en: 'Pony Trivia Challenge' },
  //  track: 'main',
  //  start: '14:15',
  //  end: '15:15',
  //  type: 'community',
  //  detail: {
  //    zh: '考驗大家對 MLP 世界的了解程度，從角色、劇情到冷知識，看看誰才是真正的小馬百科。',
  //    en: 'Test your knowledge of the MLP world, from characters and stories to fun trivia.',
  //  },
  //},
  {
    title: {
      zh: "友誼的小船說翻就翻",
      en: "The boat of friendship tips over",
    },
    track: "main",
    start: "15:30",
    end: "16:30",
    type: "community",
    detail: {
      zh: "最刺激的友誼破冰遊戲，你與朋友之間的友情是否經得起考驗(本活動將會有大型社死現場，歡迎內心勇敢堅強的你前來挑戰)",
      en: "The most thrilling friendship icebreaker! Is your bond with your friends strong enough to survive the ultimate test? (This event features massive public embarrassment and hilarious cringe moments. Brave and fearless souls are highly welcome to take on the challenge!)",
    },
  },
  //{
  //  title: {
  //    zh: '友誼回憶錄\n劇照大挑戰\n友誼就是翻譯災難',
  //    en: 'Friendship Memories\nScreenshot Challenge\nFriendship Is Translation Chaos',
  //  },
  //  track: 'main',
  //  start: '15:30',
  //  end: '16:30',
  //  type: 'community',
  //  detail: {
  //    zh: '透過經典劇照與翻譯片段挑戰記憶與默契，重溫那些只有老粉才懂的名場面與迷因。',
  //    en: 'Challenge your memory with classic screenshots and translation moments, revisiting memes and scenes longtime fans know well.',
  //  },
  //},
  {
    title: { zh: "彩虹音爆", en: "Sonic Rainboom" },
    track: "main",
    start: "18:00",
    end: "20:00",
    type: "music",
    detail: {
      zh: "身為馬迷的你，彩虹小馬的音樂是否讓你朗朗上口呢？你是否一直不斷的重複聽小馬音樂呢？夜場音樂派對將會有3位DJ輪流上台演出帶著各位狂歡，小馬歌曲你複習了嗎？",
      en: "As a Brony, are the catchy tunes of My Little Pony constantly stuck in your head? Do you find yourself on an endless loop listening to MLP music? The late-night music party will feature 3 DJs taking turns on stage to hype up the crowd. Have you reviewed your favorite MLP songs yet?",
    },
  },
  {
    title: { zh: "大合唱", en: "Sing-along" },
    track: "main",
    start: "20:00",
    end: "20:50",
    type: "sing",
    detail: {
      zh: "一起合唱各位最喜歡的小馬歌曲",
      en: "Let's sing along to everyone's favorite My Little Pony songs together!",
    },
  },
  //{
  //  title: { zh: '大合照', en: 'Group Photo' },
  //  track: 'main',
  //  start: '20:50',
  //  end: '21:00',
  //  type: 'photo',
  //  detail: {
  //    zh: '活動尾聲的大合照時間，歡迎帶上裝扮、OC 或周邊，一起留下紀念。',
  //    en: 'Group photo time near the end of the event. Bring your cosplay, OC, or merch for a keepsake.',
  //  },
  //},
  {
    title: { zh: "工坊區開放", en: "Workshop Open" },
    track: "workshop",
    start: "10:30",
    end: "17:00",
    type: "workshop",
    detail: {
      zh: "提供紙跟色彩筆，可以自由畫畫的地方。",
      en: "Paper and colored pencils are provided, and there is a place where you can draw freely.",
    },
  },
  {
    title: { zh: "攤位街", en: "Vendor Alley" },
    track: "vendor",
    start: "10:30",
    end: "12:00",
    type: "vendor",
    detail: {
      zh: "攤位街開放，可以逛創作攤位、收藏周邊，支持喜歡的創作者。",
      en: "Vendor Alley opens in the morning. Browse creator booths, collect merch, and support your favorite artists.",
    },
  },
  {
    title: { zh: "攤位街", en: "Vendor Alley" },
    track: "vendor",
    start: "13:00",
    end: "17:00",
    type: "vendor",
    detail: {
      zh: "攤位街開放，可以逛創作攤位、收藏周邊，支持喜歡的創作者。",
      en: "Vendor Alley remains open in the afternoon.",
    },
  },
  {
    title: { zh: "交誼區", en: "Social Area" },
    track: "social",
    start: "10:30",
    end: "12:00",
    type: "social",
    detail: {
      zh: "擁有大桌及椅子的區域，可以和其他參加者一起聊天或玩各種桌遊與互動遊戲。",
      en: "The area features large tables and chairs where participants can chat or play various board games and interactive games.",
    },
  },
  //{
  //  title: {
  //    zh: '誰是幻形靈\n桌遊時間',
  //    en: 'Who Is the Changeling?\nBoard Game Time',
  //  },
  //  track: 'social',
  //  start: '12:00',
  //  end: '13:00',
  //  type: 'social-special',
  //  detail: {
  //    zh: '一起進行陣營與推理類桌遊，找出隱藏在人群中的幻形靈。',
  //    en: 'Play a social deduction board game and find the changeling hidden among the group.',
  //  },
  //},
  {
    title: { zh: "交誼區", en: "Social Area" },
    track: "social",
    start: "13:00",
    end: "17:00",
    type: "social",
    detail: {
      zh: "擁有大桌及椅子的區域，可以和其他參加者一起聊天或玩各種桌遊與互動遊戲。",
      en: "The area features large tables and chairs where participants can chat or play various board games and interactive games.",
    },
  },
];
