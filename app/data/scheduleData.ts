export type EventType =
  | 'entry'
  | 'opening'
  | 'community'
  | 'break'
  | 'talk'
  | 'music'
  | 'sing'
  | 'photo'
  | 'workshop'
  | 'vendor'
  | 'game'
  | 'game-special'

export interface LocalizedText {
  zh: string
  en: string
}

export interface Column {
  key: string
  label?: LocalizedText
  min: string
  grow?: number
  color?: string
}

export interface TimetableEvent {
  title: LocalizedText
  track: string
  start: string
  end: string
  type: EventType
  detail?: LocalizedText
  vertical?: boolean
  PointerEvent?: boolean
}

export const EVENT_COLORS: Record<EventType, string> = {
  entry: '#ececec',
  opening: '#d7d8f3',
  community: '#ee7ab0',
  break: '#c7c6df',
  talk: '#efd992',
  music: '#175b9f',
  sing: '#235cc9',
  photo: '#d9ebf5',
  workshop: '#ffaa82',
  vendor: '#d6aa03',
  game: '#81fff9',
  'game-special': '#149be6',
}

export const startHour = 9
export const endHour = 21.5
export const slotMinutes = 5

export const columns: Column[] = [
  { key: 'time-left', min: '5em' },
  {
    key: 'main',
    label: { zh: '主舞台', en: 'Main Stage' },
    min: '10em',
    grow: 1.25,
    color: '#efefef',
  },
  {
    key: 'workshop',
    label: { zh: '工坊區', en: 'Workshop' },
    min: '7em',
    grow: 1,
    color: '#efefef',
  },
  {
    key: 'vendor',
    label: { zh: '攤位街', en: 'Vendor Alley' },
    min: '6.5em',
    grow: 1,
    color: '#efefef',
  },
  {
    key: 'game',
    label: { zh: '遊戲區', en: 'Game Area' },
    min: '7.5em',
    grow: 1.05,
    color: '#efefef',
  },
  { key: 'time-right', min: '5em' },
]

export const events: TimetableEvent[] = [
  {
    title: { zh: '進場', en: 'Entry' },
    track: 'main',
    start: '09:30',
    end: '10:00',
    type: 'entry',
    detail: {
      zh: '開放入場與自由交流時間，可以先熟悉場地、攤位位置，和其他小馬迷打招呼。',
      en: 'Entry and free social time. Get familiar with the venue and vendor area, and say hello to fellow pony fans.',
    },
  },
  {
    title: { zh: '開場介紹', en: 'Opening' },
    track: 'main',
    start: '10:00',
    end: '10:30',
    type: 'opening',
    detail: {
      zh: '活動正式開始，介紹本日流程、活動區域、注意事項，以及各項精彩內容。',
      en: 'The event officially begins with an introduction to the schedule, areas, rules, and highlights of the day.',
    },
  },
  {
    title: { zh: '瘋狂小馬故事', en: 'Crazy Pony Stories' },
    track: 'main',
    start: '10:45',
    end: '11:45',
    type: 'community',
    detail: {
      zh: '一起分享那些最混亂、最爆笑、最不可思議的小馬故事與回憶，看看誰才是真正的友情傳奇。',
      en: 'Share the most chaotic, hilarious, and unbelievable pony stories and memories.',
    },
  },
  {
    title: {
      zh: '休息時間(影片欣賞)\nA Decade of Pony',
      en: 'Break / Screening\nA Decade of Pony',
    },
    track: 'main',
    start: '12:00',
    end: '13:00',
    type: 'break',
    detail: {
      zh: '午間休息時段，現場將播放《A Decade of Pony》，一起回顧十年來的小馬旅程與社群記憶。',
      en: 'During the noon break, A Decade of Pony will be screened as we look back on years of pony memories.',
    },
  },
  {
    title: { zh: '專題分享\n青焰布偶', en: 'Featured Talk\nQingyan Plush' },
    track: 'main',
    start: '13:00',
    end: '14:00',
    type: 'talk',
    detail: {
      zh: '由青焰帶來的小馬主題分享，內容可能包含創作、社群、翻譯或多年來的心得與經歷。',
      en: 'A pony-themed talk by Qingyan, possibly covering creation, community, translation, and years of experience.',
    },
  },
  {
    title: { zh: '小馬知識大挑戰', en: 'Pony Trivia Challenge' },
    track: 'main',
    start: '14:15',
    end: '15:15',
    type: 'community',
    detail: {
      zh: '考驗大家對 MLP 世界的了解程度，從角色、劇情到冷知識，看看誰才是真正的小馬百科。',
      en: 'Test your knowledge of the MLP world, from characters and stories to fun trivia.',
    },
  },
  {
    title: {
      zh: '友誼回憶錄\n劇照大挑戰\n友誼就是翻譯災難',
      en: 'Friendship Memories\nScreenshot Challenge\nFriendship Is Translation Chaos',
    },
    track: 'main',
    start: '15:30',
    end: '16:30',
    type: 'community',
    detail: {
      zh: '透過經典劇照與翻譯片段挑戰記憶與默契，重溫那些只有老粉才懂的名場面與迷因。',
      en: 'Challenge your memory with classic screenshots and translation moments, revisiting memes and scenes longtime fans know well.',
    },
  },
  {
    title: { zh: '音樂派對', en: 'Music Party' },
    track: 'main',
    start: '18:00',
    end: '19:50',
    type: 'music',
    detail: {
      zh: '夜晚的小馬音樂時間，現場播放各種 Brony 音樂與 Remix，一起享受友情與節奏。',
      en: 'An evening pony music session with Brony music and remixes. Enjoy friendship and rhythm together.',
    },
  },
  {
    title: { zh: '大合唱', en: 'Sing-along' },
    track: 'main',
    start: '19:50',
    end: '20:30',
    type: 'sing',
    detail: {
      zh: '一起合唱熟悉的小馬歌曲，為活動留下最熱鬧也最難忘的回憶。',
      en: 'Sing familiar pony songs together and create a lively, unforgettable memory.',
    },
  },
  {
    title: { zh: '大合照', en: 'Group Photo' },
    track: 'main',
    start: '20:30',
    end: '21:00',
    type: 'photo',
    detail: {
      zh: '活動尾聲的大合照時間，歡迎帶上裝扮、OC 或周邊，一起留下紀念。',
      en: 'Group photo time near the end of the event. Bring your cosplay, OC, or merch for a keepsake.',
    },
  },
  {
    title: { zh: '工坊區開放', en: 'Workshop Open' },
    track: 'workshop',
    start: '10:30',
    end: '17:00',
    type: 'workshop',
    detail: {
      zh: '工坊區全天開放，現場提供手作與創作交流空間，可以自由參與體驗。',
      en: 'The workshop area is open all day, offering space for hands-on creation and creative exchange.',
    },
  },
  {
    title: { zh: '攤位街', en: 'Vendor Alley' },
    track: 'vendor',
    start: '10:30',
    end: '12:00',
    type: 'vendor',
    detail: {
      zh: '上午攤位街開放，可以逛創作攤位、收藏周邊，支持喜歡的創作者。',
      en: 'Vendor Alley opens in the morning. Browse creator booths, collect merch, and support your favorite artists.',
    },
  },
  {
    title: { zh: '攤位街', en: 'Vendor Alley' },
    track: 'vendor',
    start: '13:00',
    end: '17:00',
    type: 'vendor',
    detail: {
      zh: '下午攤位街持續開放，歡迎慢慢探索各式小馬創作與特色商品。',
      en: 'Vendor Alley remains open in the afternoon. Take your time exploring pony creations and special goods.',
    },
  },
  {
    title: { zh: '桌遊', en: 'Board Games' },
    track: 'game',
    start: '10:30',
    end: '12:00',
    type: 'game',
    detail: {
      zh: '自由桌遊時段，可以和其他參加者一起遊玩各種桌遊與互動遊戲。',
      en: 'Free board game time. Join other attendees for board games and interactive games.',
    },
  },
  {
    title: {
      zh: '誰是幻形靈\n桌遊時間',
      en: 'Who Is the Changeling?\nBoard Game Time',
    },
    track: 'game',
    start: '12:00',
    end: '13:00',
    type: 'game-special',
    detail: {
      zh: '一起進行陣營與推理類桌遊，找出隱藏在人群中的幻形靈。',
      en: 'Play a social deduction board game and find the changeling hidden among the group.',
    },
  },
  {
    title: { zh: '桌遊', en: 'Board Games' },
    track: 'game',
    start: '13:00',
    end: '17:00',
    type: 'game',
    detail: {
      zh: '下午自由桌遊時段，歡迎隨時加入，一起享受友情與遊戲時光。',
      en: 'Afternoon free board game time. Join anytime and enjoy friendship and games.',
    },
  },
]
