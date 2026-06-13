declare global {
  interface Window {
    renderExpoTimetable?: () => void
  }
}

export {}

;(() => {
  function initTimetable() {
    const getIsEnglish = () =>
      document.documentElement?.lang?.toLowerCase().startsWith('en') ||
      window.location.pathname.startsWith('/en')

    const text = (zh: string, en: string) => (getIsEnglish() ? en : zh)

    const slotMinutes = 5

    type Column = {
      key: string
      label: string
      min: string
      grow?: number
      color?: string
      width?: string
    }

    type TimetableEvent = {
      title: string
      track: string
      start: string
      end: string
      textColor?: string
      color?: string
      detail?: string
      vertical?: boolean
      PointerEvent?: boolean
    }

    function getTimetableData(): {
      startHour: number
      endHour: number
      columns: Column[]
      events: TimetableEvent[]
    } {
      return {
        startHour: 9,
        endHour: 21.5,

        columns: [
          { key: 'time-left', label: '', min: '5em' },
          { key: 'main', label: text('主舞台', 'Main Stage'), min: '10em', grow: 1.25, color: '#333' },
          { key: 'workshop', label: text('工坊區', 'Workshop'), min: '7em', grow: 1, color: '#333' },
          { key: 'vendor', label: text('攤位街', 'Vendor Alley'), min: '6.5em', grow: 1, color: '#333' },
          { key: 'game', label: text('遊戲區', 'Game Area'), min: '7.5em', grow: 1.05, color: '#333' },
          { key: 'time-right', label: '', min: '5em' },
        ],

        events: [
          {
            title: text('進場', 'Entry'),
            track: 'main',
            start: '09:30',
            end: '10:00',
            textColor: '#000',
            color: '#ececec',
            detail: text(
              '開放入場與自由交流時間，可以先熟悉場地、攤位位置，和其他小馬迷打招呼。',
              'Entry and free social time. Get familiar with the venue and vendor area, and say hello to fellow pony fans.',
            ),
          },
          {
            title: text('開場介紹', 'Opening'),
            track: 'main',
            start: '10:00',
            end: '10:30',
            textColor: '#000',
            color: '#d7d8f3',
            detail: text(
              '活動正式開始，介紹本日流程、活動區域、注意事項，以及各項精彩內容。',
              'The event officially begins with an introduction to the schedule, areas, rules, and highlights of the day.',
            ),
          },
          {
            title: text('瘋狂小馬故事', 'Crazy Pony Stories'),
            track: 'main',
            start: '10:45',
            end: '11:45',
            textColor: '#000',
            color: '#ee7ab0',
            detail: text(
              '一起分享那些最混亂、最爆笑、最不可思議的小馬故事與回憶，看看誰才是真正的友情傳奇。',
              'Share the most chaotic, hilarious, and unbelievable pony stories and memories.',
            ),
          },
          {
            title: text('休息時間(影片欣賞)\nA Decade of Pony', 'Break / Screening\nA Decade of Pony'),
            track: 'main',
            start: '12:00',
            end: '13:00',
            textColor: '#000',
            color: '#c7c6df',
            detail: text(
              '午間休息時段，現場將播放《A Decade of Pony》，一起回顧十年來的小馬旅程與社群記憶。',
              'During the noon break, A Decade of Pony will be screened as we look back on years of pony memories.',
            ),
          },
          {
            title: text('專題分享\n青焰布偶', 'Featured Talk\nQingyan Plush'),
            track: 'main',
            start: '13:00',
            end: '14:00',
            textColor: '#000',
            color: '#efd992',
            detail: text(
              '由青焰帶來的小馬主題分享，內容可能包含創作、社群、翻譯或多年來的心得與經歷。',
              'A pony-themed talk by Qingyan, possibly covering creation, community, translation, and years of experience.',
            ),
          },
          {
            title: text('小馬知識大挑戰', 'Pony Trivia Challenge'),
            track: 'main',
            start: '14:15',
            end: '15:15',
            textColor: '#000',
            color: '#ee7ab0',
            detail: text(
              '考驗大家對 MLP 世界的了解程度，從角色、劇情到冷知識，看看誰才是真正的小馬百科。',
              'Test your knowledge of the MLP world, from characters and stories to fun trivia.',
            ),
          },
          {
            title: text('友誼回憶錄\n劇照大挑戰\n友誼就是翻譯災難', 'Friendship Memories\nScreenshot Challenge\nFriendship Is Translation Chaos'),
            track: 'main',
            start: '15:30',
            end: '16:30',
            textColor: '#000',
            color: '#ee7ab0',
            detail: text(
              '透過經典劇照與翻譯片段挑戰記憶與默契，重溫那些只有老粉才懂的名場面與迷因。',
              'Challenge your memory with classic screenshots and translation moments, revisiting memes and scenes longtime fans know well.',
            ),
          },
          {
            title: text('音樂派對', 'Music Party'),
            track: 'main',
            start: '18:00',
            end: '19:50',
            textColor: '#fff',
            color: '#175b9f',
            detail: text(
              '夜晚的小馬音樂時間，現場播放各種 Brony 音樂與 Remix，一起享受友情與節奏。',
              'An evening pony music session with Brony music and remixes. Enjoy friendship and rhythm together.',
            ),
          },
          {
            title: text('大合唱', 'Sing-along'),
            track: 'main',
            start: '19:50',
            end: '20:30',
            textColor: '#fff',
            color: '#235cc9',
            detail: text(
              '一起合唱熟悉的小馬歌曲，為活動留下最熱鬧也最難忘的回憶。',
              'Sing familiar pony songs together and create a lively, unforgettable memory.',
            ),
          },
          {
            title: text('大合照', 'Group Photo'),
            track: 'main',
            start: '20:30',
            end: '21:00',
            textColor: '#000',
            color: '#d9ebf5',
            detail: text(
              '活動尾聲的大合照時間，歡迎帶上裝扮、OC 或周邊，一起留下紀念。',
              'Group photo time near the end of the event. Bring your cosplay, OC, or merch for a keepsake.',
            ),
          },
          {
            title: text('工坊區開放', 'Workshop Open'),
            track: 'workshop',
            start: '10:30',
            end: '17:00',
            textColor: '#000',
            color: '#ffaa82',
            detail: text(
              '工坊區全天開放，現場提供手作與創作交流空間，可以自由參與體驗。',
              'The workshop area is open all day, offering space for hands-on creation and creative exchange.',
            ),
          },
          {
            title: text('攤位街', 'Vendor Alley'),
            track: 'vendor',
            start: '10:30',
            end: '12:00',
            textColor: '#000',
            color: '#d6aa03',
            detail: text(
              '上午攤位街開放，可以逛創作攤位、收藏周邊，支持喜歡的創作者。',
              'Vendor Alley opens in the morning. Browse creator booths, collect merch, and support your favorite artists.',
            ),
          },
          {
            title: text('攤位街', 'Vendor Alley'),
            track: 'vendor',
            start: '13:00',
            end: '17:00',
            textColor: '#000',
            color: '#d6aa03',
            detail: text(
              '下午攤位街持續開放，歡迎慢慢探索各式小馬創作與特色商品。',
              'Vendor Alley remains open in the afternoon. Take your time exploring pony creations and special goods.',
            ),
          },
          {
            title: text('桌遊', 'Board Games'),
            track: 'game',
            start: '10:30',
            end: '12:00',
            textColor: '#000',
            color: '#81fff9',
            detail: text(
              '自由桌遊時段，可以和其他參加者一起遊玩各種桌遊與互動遊戲。',
              'Free board game time. Join other attendees for board games and interactive games.',
            ),
          },
          {
            title: text('誰是幻形靈\n桌遊時間', 'Who Is the Changeling?\nBoard Game Time'),
            track: 'game',
            start: '12:00',
            end: '13:00',
            textColor: '#fff',
            color: '#149be6',
            detail: text(
              '一起進行陣營與推理類桌遊，找出隱藏在人群中的幻形靈。',
              'Play a social deduction board game and find the changeling hidden among the group.',
            ),
          },
          {
            title: text('桌遊', 'Board Games'),
            track: 'game',
            start: '13:00',
            end: '17:00',
            textColor: '#000',
            color: '#81fff9',
            detail: text(
              '下午自由桌遊時段，歡迎隨時加入，一起享受友情與遊戲時光。',
              'Afternoon free board game time. Join anytime and enjoy friendship and games.',
            ),
          },
        ],
      }
    }

    let isBound = false
    let focusedEventIndex = -1
    let openedEventIndex = -1
    let selectableEvents: HTMLElement[] = []

    function getEls() {
      return {
        grid: document.getElementById('expoTimetable'),
        modal: document.getElementById('expoTtModal'),
        modalBody: document.getElementById('expoTtModalBody'),
      }
    }

    function escapeHtml(str = '') {
      return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
    }

    function formatTitle(title = '') {
      return escapeHtml(title).replaceAll('\n', '<br>')
    }

    function timeToMinutes(time: string) {
      const [h = 0, m = 0] = String(time).split(':').map(Number)
      return h * 60 + m
    }

    function hourToMinutes(hour: number) {
      return Math.round(Number(hour) * 60)
    }

    function timeToSlotIndex(time: string, timetableData = getTimetableData()) {
      const startMinutes = hourToMinutes(timetableData.startHour)
      return Math.round((timeToMinutes(time) - startMinutes) / slotMinutes)
    }

    function timeToGridRowStart(time: string, timetableData = getTimetableData()) {
      return 2 + timeToSlotIndex(time, timetableData)
    }

    function timeSpanSlots(start: string, end: string, timetableData = getTimetableData()) {
      return Math.max(1, timeToSlotIndex(end, timetableData) - timeToSlotIndex(start, timetableData))
    }

    function getColumnIndex(trackKey: string, timetableData = getTimetableData()) {
      const index = timetableData.columns.findIndex(col => col.key === trackKey)
      return index >= 0 ? index + 1 : 2
    }

    function areaLabelByTrack(trackKey: string, timetableData = getTimetableData()) {
      const col = timetableData.columns.find(item => item.key === trackKey)
      return col?.label || col?.key || ''
    }

    function normalizeHexColor(color?: string) {
      if (!color || typeof color !== 'string') return '#235cc9'

      let hex = color.trim()

      if (!hex.startsWith('#')) hex = `#${hex}`

      if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
        hex = `#${hex
          .slice(1)
          .split('')
          .map(char => char + char)
          .join('')}`
      }

      if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return '#235cc9'

      return hex
    }

    function getContrastColor() {
      return '#222'
    }

    function formatHourLabel(hour: number) {
      const h = Math.floor(hour)
      const m = Math.round((hour - h) * 60)

      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }

    function clearFocus() {
      focusedEventIndex = -1

      selectableEvents.forEach(el => {
        el.classList.remove('keyboard-focus')
      })
    }

    function updateFocusedEvent() {
      selectableEvents.forEach(el => {
        el.classList.remove('keyboard-focus')
      })

      if (focusedEventIndex < 0) return

      if (focusedEventIndex >= selectableEvents.length) {
        focusedEventIndex = selectableEvents.length - 1
      }

      const current = selectableEvents[focusedEventIndex]
      if (!current) return

      current.classList.add('keyboard-focus')

      current.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      })
    }

    function moveFocus(direction: 'up' | 'down' | 'left' | 'right') {
      if (!selectableEvents.length) return

      if (focusedEventIndex < 0) {
        focusedEventIndex = 0
        updateFocusedEvent()
        return
      }

      const current = selectableEvents[focusedEventIndex]
      if (!current) return

      const currentRect = current.getBoundingClientRect()

      let bestIndex = focusedEventIndex
      let bestScore = Infinity

      selectableEvents.forEach((el, index) => {
        if (index === focusedEventIndex) return

        const rect = el.getBoundingClientRect()

        const dx = rect.left - currentRect.left
        const dy = rect.top - currentRect.top

        const overlapY =
          Math.min(currentRect.bottom, rect.bottom) -
          Math.max(currentRect.top, rect.top)

        const overlapX =
          Math.min(currentRect.right, rect.right) -
          Math.max(currentRect.left, rect.left)

        let valid = false
        let score = Infinity

        switch (direction) {
          case 'right':
            valid = dx > 5 && overlapY > 10
            score = Math.abs(dx) - overlapY * 5
            break

          case 'left':
            valid = dx < -5 && overlapY > 10
            score = Math.abs(dx) - overlapY * 5
            break

          case 'down':
            valid = dy > 5 && overlapX > 10
            score = Math.abs(dy) - overlapX * 2
            break

          case 'up':
            valid = dy < -5 && overlapX > 10
            score = Math.abs(dy) - overlapX * 2
            break
        }

        if (valid && score < bestScore) {
          bestScore = score
          bestIndex = index
        }
      })

      focusedEventIndex = bestIndex
      updateFocusedEvent()
    }

    function renderTimetable() {
      const timetableData = getTimetableData()
      const els = getEls()
      if (!els.grid) return false

      const slotsPerHour = 60 / slotMinutes
      const totalHours = timetableData.endHour - timetableData.startHour
      const totalSlots = Math.round(totalHours * slotsPerHour)

      const gridColumns = timetableData.columns
        .map(col => {
          const min = col.min || col.width || '8em'

          if (col.key === 'time-left' || col.key === 'time-right') {
            return min
          }

          return `minmax(${min}, ${col.grow || 1}fr)`
        })
        .join(' ')

      const rightTimeColumn = timetableData.columns.length
      const contentStart = 2
      const contentEnd = timetableData.columns.length

      els.grid.style.setProperty('--columns', gridColumns)
      els.grid.style.setProperty('--rows', `4em repeat(${totalSlots}, var(--slot-h))`)
      els.grid.style.setProperty('--content-start', String(contentStart))
      els.grid.style.setProperty('--content-end', String(contentEnd))

      let html = ''

      timetableData.columns.forEach((col, index) => {
        if (!col.label) return

        html += `
          <div
            class="expo-col-title"
            style="
              grid-column:${index + 1};
              grid-row:1;
              color:${col.color || '#3f71e6'};
            "
          >
            ${escapeHtml(col.label)}
          </div>
        `
      })

      html += '<div class="expo-slot-bg"></div>'

      for (let h = timetableData.startHour; h < timetableData.endHour; h++) {
        const hourRow =
          2 + Math.round((hourToMinutes(h) - hourToMinutes(timetableData.startHour)) / slotMinutes)

        const halfHour = h + 0.5

        const halfRow =
          2 + Math.round((hourToMinutes(halfHour) - hourToMinutes(timetableData.startHour)) / slotMinutes)

        html += `
          <div class="expo-time" style="grid-column:1; grid-row:${hourRow};">
            ${formatHourLabel(h)}
          </div>
        `

        if (halfHour < timetableData.endHour) {
          html += `
            <div class="expo-time expo-time-half" style="grid-column:${rightTimeColumn}; grid-row:${halfRow};">
              ${formatHourLabel(halfHour)}
            </div>
          `
        }
      }

      timetableData.events.forEach((event, index) => {
        const columnIndex = getColumnIndex(event.track, timetableData)
        const startRow = timeToGridRowStart(event.start, timetableData)
        const rowSpan = timeSpanSlots(event.start, event.end, timetableData)
        const isCompact = rowSpan <= 5

        const eventColor = normalizeHexColor(event.color)
        const textColor = event.textColor || getContrastColor()

        const classes = [
          'expo-event',
          event.vertical ? 'vertical' : '',
          isCompact ? 'compact' : '',
        ]
          .filter(Boolean)
          .join(' ')

        html += `
          <button
            type="button"
            class="${classes}"
            data-index="${index}"
            style="
              grid-column:${columnIndex};
              grid-row:${startRow} / span ${rowSpan};
              background:${eventColor};
              color:${textColor};
              pointer-events:${event.PointerEvent === false ? 'none' : 'auto'};
            "
          >
            <span class="title">${formatTitle(event.title)}</span>
            ${
              event.vertical || isCompact
                ? ''
                : `<span class="sub">${escapeHtml(event.start)} - ${escapeHtml(event.end)}</span>`
            }
          </button>
        `
      })

      els.grid.innerHTML = html

      selectableEvents = Array.from(
        els.grid.querySelectorAll<HTMLElement>('.expo-event'),
      ).filter(el => el.style.pointerEvents !== 'none')

      clearFocus()

      return true
    }

    function openModal(index: number) {
      const timetableData = getTimetableData()
      const els = getEls()
      const event = timetableData.events[index]

      if (!els.modal || !els.modalBody || !event) return

      const duration =
        ((timeToMinutes(event.end) - timeToMinutes(event.start)) / 60)
          .toFixed(1)
          .replace('.0', '')

      els.modalBody.innerHTML = `
        <h3>${formatTitle(event.title)}</h3>

        <div class="expo-tt-modal-meta">
          <span>
            🕒 ${escapeHtml(event.start)} - ${escapeHtml(event.end)}
            ▶ ${text('時長', 'Duration')} ${duration}h
          </span>

          <span>📍 ${text('區域', 'Area')}: ${escapeHtml(areaLabelByTrack(event.track, timetableData))}</span>
        </div>

        <p>${escapeHtml(event.detail || text('詳細資訊之後補上。', 'Details will be added later.'))}</p>
      `

      openedEventIndex = index

      els.modal.classList.add('show')
      els.modal.setAttribute('aria-hidden', 'false')
      document.body.style.overflow = 'hidden'
    }

    function closeModal() {
      const els = getEls()
      if (!els.modal) return

      openedEventIndex = -1

      els.modal.classList.remove('show')
      els.modal.setAttribute('aria-hidden', 'true')
      document.body.style.overflow = ''
    }

    function focusEventByIndex(index: number) {
      const eventBtn = selectableEvents.find(el => Number(el.dataset.index) === index)

      if (!eventBtn) return

      focusedEventIndex = selectableEvents.indexOf(eventBtn)
      updateFocusedEvent()
    }

    function openEvent(index: number) {
      focusEventByIndex(index)
      openModal(index)
    }

    function toggleEvent(index: number, clearFocusWhenClose: boolean) {
      const modalOpen = getEls().modal?.classList.contains('show')

      if (modalOpen && openedEventIndex === index) {
        closeModal()

        if (clearFocusWhenClose) {
          clearFocus()
        }

        return
      }

      openEvent(index)
    }

    function getCurrentEventIndex() {
      if (!selectableEvents.length) return -1

      if (focusedEventIndex < 0) {
        focusedEventIndex = 0
        updateFocusedEvent()
      }

      const current = selectableEvents[focusedEventIndex]
      if (!current) return -1

      return Number(current.dataset.index)
    }

    function bindEvents() {
      if (isBound) return
      isBound = true

      document.addEventListener('click', e => {
        const target = e.target as HTMLElement | null
        if (!target) return

        const eventBtn = target.closest<HTMLElement>('.expo-event')

        if (eventBtn) {
          toggleEvent(Number(eventBtn.dataset.index), true)
          return
        }

        if (
          target.closest('#expoTtModalClose') ||
          target.closest("[data-close='true']")
        ) {
          closeModal()
          clearFocus()
          return
        }
      })

      document.addEventListener('keydown', e => {
        const modalOpen = getEls().modal?.classList.contains('show')

        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            if (modalOpen) return
            e.preventDefault()
            moveFocus('up')
            break

          case 's':
          case 'arrowdown':
            if (modalOpen) return
            e.preventDefault()
            moveFocus('down')
            break

          case 'a':
          case 'arrowleft':
            if (modalOpen) return
            e.preventDefault()
            moveFocus('left')
            break

          case 'd':
          case 'arrowright':
            if (modalOpen) return
            e.preventDefault()
            moveFocus('right')
            break

          case ' ': {
            e.preventDefault()

            const currentIndex = getCurrentEventIndex()
            if (currentIndex < 0) return

            toggleEvent(currentIndex, false)
            break
          }

          case 'enter': {
            e.preventDefault()

            const currentIndex = getCurrentEventIndex()
            if (currentIndex < 0) return

            openEvent(currentIndex)
            break
          }

          case 'escape':
            e.preventDefault()
            closeModal()
            clearFocus()
            break
        }
      })
    }

    function renderExpoTimetableWithRetry() {
      let tries = 0
      const maxTries = 20

      const timer = window.setInterval(() => {
        tries++

        const ok = renderTimetable()

        if (ok || tries >= maxTries) {
          window.clearInterval(timer)
        }
      }, 100)
    }

    bindEvents()
    renderExpoTimetableWithRetry()

    window.renderExpoTimetable = function () {
      requestAnimationFrame(() => {
        renderExpoTimetableWithRetry()
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimetable)
  } else {
    initTimetable()
  }
})()