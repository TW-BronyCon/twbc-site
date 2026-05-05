// ===== 區塊切換 =====
let current = 1;

const btn = document.getElementById('btn');
const section1 = document.getElementById('section1');
const section2 = document.getElementById('section2');

function update() {
    if (current === 1) {
        btn.textContent = '查看表格';

        section1.classList.add('show');
        section1.classList.remove('hidden');

        section2.classList.add('hidden');
        section2.classList.remove('show');
    } else {
        btn.textContent = '查看詳細';

        section2.classList.add('show');
        section2.classList.remove('hidden');

        section1.classList.add('hidden');
        section1.classList.remove('show');
    }
}

// 初始化
update();

btn.addEventListener('click', () => {
    current = current === 1 ? 2 : 1;
    update();
});

// ===== 返回首頁 =====
const homeBtn = document.getElementById('home');

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        window.location.href = "index.html";
        // 如果首頁是根目錄，用這行：
        // window.location.href = "/";
    });
}


// ===== 票卡點擊（雙擊進入） =====
const blocks = document.querySelectorAll('.block');

const config = {
    "經濟票": {
        url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E7%B6%93%E6%BF%9F%E7%A5%A8+$NTD:+500",
        enable: true
    },
    "標準票": {
        url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E6%A8%99%E6%BA%96%E7%A5%A8+$NTD:+600",
        enable: true
    },
    "贊助票": {
        url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E8%B4%BB%E5%8A%A9%E7%A5%A8+$NTD:+1000",
        enable: true
    },
    "貴賓票": {
        url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E8%B2%B4%E8%B3%93%E7%A5%A8+$NTD:+5000+(6/30%E6%88%AA%E6%AD%A2)",
        enable: true
    }
};

blocks.forEach(block => {
    const title = block.querySelector('.ticket-title')?.textContent.trim();
    const item = config[title];

    if (!item) return;

    // 👉 建立 <a>
    const link = document.createElement("a");

    if (item.enable) {
        link.href = item.url;
        link.target = "_blank"; // 可選：預設新分頁
    } else {
        link.href = "javascript:void(0)";
    }

    // 👉 保持外觀
    link.style.display = "block";
    link.style.textDecoration = "none";
    link.style.color = "inherit";

    // 👉 包起來
    block.parentNode.insertBefore(link, block);
    link.appendChild(block);

    // 👉 禁用狀態
    if (!item.enable) {
        block.classList.add("disabled");
    }
});