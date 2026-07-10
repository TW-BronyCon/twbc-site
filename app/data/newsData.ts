export interface LocalizedNewsPost {
  title: string;
  content: string;
}

export interface RawNewsPost {
  id: string;
  time: string;
  locales: Record<string, LocalizedNewsPost>;
}

export const rawNewsPosts: RawNewsPost[] = [
  {
    id: "post_001",
    time: "2026-01-19",
    locales: {
      en: {
        title: "Taiwan BronyCon 2026 Project Begins",
        content: "Hello everypony!\nWe are planning to hold the first-ever Taiwan BronyCon in Taipei this summer.\nOur first community survey is now open, and we warmly welcome everypony to participate.\n\nSurvey:\nhttps://docs.google.com/forms/d/e/1FAIpQLSex0IRX2WI93OMVNNuxCp0YLPKz9dX38Uz_aiVeY5Ku5-rpSg/alreadyresponded"
      },
      "zh-TW": {
        title: "TWBC台灣馬聚2026計畫開啟",
        content: "各位小馬迷好！\n預計今年暑假會在台北舉辦第一屆TWBC台灣馬聚，以下是活動首次調查，歡迎各位小馬迷踴躍填寫。\n\n調查表單：https://docs.google.com/forms/d/e/1FAIpQLSex0IRX2WI93OMVNNuxCp0YLPKz9dX38Uz_aiVeY5Ku5-rpSg/alreadyresponded"
      }
    }
  },
  {
    id: "post_002",
    time: "2026-02-09",
    locales: {
      en: {
        title: "Event Date and Venue Revealed",
        content: "Taiwan BronyCon 2026\nDate: August 15, 2026\nVenue: AS Life Space, 10F., No.111, Sec.4, Sanhe Rd., Sanchong Dist., New Taipei City (MRT Sanhe Junior High School Station Exit 2)\n\nWe look forward to seeing everypony there and creating new memories together for Taiwan's pony community!\nRegistration information and more details will be announced soon.\nYou're also welcome to join our Discord community to chat and hang out with fellow fans. Event updates will be posted there as well."
      },
      "zh-TW": {
        title: "活動日期與地點公布",
        content: "TWBC台灣馬聚 2026\n時間：2026年8月15日\n地點：阿斯生活空間 新北市三重區三和路四段111號10樓（捷運三和國中站2號出口）\n\n歡迎大家一起來玩，創造台灣馬圈全新的共同回憶！\n報名資訊與更多細節將陸續公佈。\n也歡迎加入我們的Discord社群一起交流，活動更新資訊也會同步在Discord社群公告！"
      }
    }
  },
  {
    id: "post_003",
    time: "2026-04-04",
    locales: {
      en: {
        title: "TWBC Registration Is Now Open",
        content: "Thank you for your patience, everypony!\n\nRegistration for Taiwan BronyCon 2026 is officially open.\nWhether this is your first convention or you're a seasoned attendee, we sincerely invite you to join us and enjoy a gathering created by and for Taiwan's pony community.\n\nClick the link below to register now.\nRegistration Form (Closes July 26):\nhttps://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform\n\nNotes:\n- This is an all-ages event.\n- Please refer to the registration form for detailed rules and information.\n\nSee you all at TWBC!"
      },
      "zh-TW": {
        title: "TWBC正式開放報名",
        content: "各位馬迷們久等了！\n\n「2026 TWBC台灣馬聚」現在正式開放報名！\n無論你是第一次參加的新朋友，還是聚會老手，我們都誠摯邀請你前來，享受專屬台灣馬迷的聚會。\n\n報名表單（7/26截止）：\nhttps://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform\n\n注意事項：\n- 本活動為全年齡向活動。\n- 詳細規則請參閱報名表單說明。\n\n我們在TWBC不見不散！"
      }
    }
  },
  {
    id: "post_004",
    time: "2026-04-18",
    locales: {
      en: {
        title: "TWBC Applications Are Now Open",
        content: "Hello everypony!\nHere's the latest update from Taiwan BronyCon.\nToday we're excited to announce that two application categories are now open.\n\nVendor Applications\nWant to sell your creations at the convention?\nWhether it's handmade crafts, artwork, or merchandise, we'd love to have you.\nApplication Form:\nhttps://docs.google.com/forms/d/e/1FAIpQLSe_AH-DG67VmJxCAm8Dt07m8IosoE765XZKukSn5AIWN-HIvQ/viewform\n\nCommunity Event Applications\nWant to host your own activity at TWBC?\nPanels, games, workshops, and more are all welcome.\nApplication Form:\nhttps://docs.google.com/forms/d/e/1FAIpQLSf1h5OaWHYf2cdqkEwWk_SWcNioLj89ilOAtr1g1sbupTPk1w/viewform\n\nFriendly Reminder:\nAvailable slots are limited, and all applications will be reviewed before approval."
      },
      "zh-TW": {
        title: "TWBC開放活動與攤位申請",
        content: "大家好！\n今天要和大家分享「TWBC台灣馬聚」的最新動態，兩項申請正式開放：\n\n攤位申請\n想在馬聚現場販售你的作品嗎？\n無論是手作、繪畫還是週邊商品，都非常歡迎前來擺攤！\n申請表單：https://docs.google.com/forms/d/e/1FAIpQLSe_AH-DG67VmJxCAm8Dt07m8IosoE765XZKukSn5AIWN-HIvQ/viewform\n\n自主活動申請\n想在TWBC舉辦屬於自己的活動嗎？\n不管是座談、遊戲還是工作坊，只要你有想法，我們都歡迎！\n申請表單：https://docs.google.com/forms/d/e/1FAIpQLSf1h5OaWHYf2cdqkEwWk_SWcNioLj89ilOAtr1g1sbupTPk1w/viewform\n\n溫馨提醒：名額有限，我們將會對申請內容進行審核。"
      }
    }
  },
  {
    id: "post_005",
    time: "2026-04-27",
    locales: {
      en: {
        title: "TWBC Event Preview",
        content: "TWBC 2026 will officially feature an evening music party and a community sing-along session.\nWe're now collecting song suggestions for the sing-along.\nIf you love pony music, we'd love to hear your recommendations.\n\nSong Submission Form (Official and fan-made songs are both welcome):\nhttps://docs.google.com/forms/d/e/1FAIpQLSenT_SECm3wHZWBY3VyB-UZjvy8lTBBmJEqrcJJYaxKmHNouw/viewform"
      },
      "zh-TW": {
        title: "TWBC活動預告",
        content: "2026 TWBC確定將會舉辦晚場音樂派對與大合唱環節！\n今天正式開放大合唱曲目徵集，歡迎喜愛小馬音樂的朋友踴躍推薦。\n\n歌曲徵集表單（寫下你喜愛的小馬歌曲，官方或同人創作皆可）：\nhttps://docs.google.com/forms/d/e/1FAIpQLSenT_SECm3wHZWBY3VyB-UZjvy8lTBBmJEqrcJJYaxKmHNouw/viewform"
      }
    }
  },
  {
    id: "post_006",
    time: "2026-05-06",
    locales: {
      en: {
        title: "Official Website Now Online",
        content: "The official TWBC website is now online.\nAfter months of preparation, we're excited to officially launch the Taiwan BronyCon website.\n\nYou can now find:\n- Ticket Information\n- Community Event Applications\n- Vendor Applications\n- Volunteer Recruitment Information\n\nMore content and updates will be added soon.\nOur Website:\nhttps://twbronycon.org/"
      },
      "zh-TW": {
        title: "官方網站正式上線",
        content: "TWBC 官方網站正式上線！\n經過這段時間的籌備，我們終於能正式公開 Taiwan BronyCon 的官方網站了。\n\n現在你可以查看：\n- 購票資訊\n- 自主活動申請資訊\n- 攤位申請資訊\n- 志工招募資訊\n\n更多內容將陸續更新，敬請期待。\n官網：https://twbronycon.org/"
      }
    }
  },
  {
    id: "post_008",
    time: "2026-07-01",
    locales: {
      en: {
        title: "Royale Tickets Are No Longer Available",
        content: "Thank you all for your enthusiastic support!\nRoyale Tickets for TWBC 2026 were only available until the end of June.\n\nTaoyi can feel everyone's blessings and excitement as well.\nIf you haven't bought your ticket yet, don't worry — other ticket tiers are still available.\n\nWe look forward to seeing you at Taiwan BronyCon!"
      },
      "zh-TW": {
        title: "貴賓票已停售囉 !",
        content: "謝謝大家的熱情支持，TWBC 2026 貴賓票販售期限只到6月底！\n\n桃漪也感受到大家滿滿的祝福與期待。還沒買票的朋友也別擔心，其他票種仍可選購，歡迎一起來台灣馬聚相見！"
      }
    }
  }
];
