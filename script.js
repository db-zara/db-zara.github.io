document.getElementById('button1').addEventListener('click', showMain);
document.getElementById('button2').addEventListener('click', () => showRandomText('2'));
document.getElementById('button3').addEventListener('click', () => showRandomText('3'));
document.getElementById('button4').addEventListener('click', showGrassPage);
document.getElementById('button5').addEventListener('click', () => loadBooksPage());

function showMain() {
    window.location.reload();  
}

function displayEmail() {
    const emailUser = "gwaaamegi";
    const emailDomain = "kakao.com";
    const emailElement = document.getElementById('email-placeholder');

    const emailLink = `<a href="mailto:${emailUser}@${emailDomain}">${emailUser}@${emailDomain}</a>`;
    emailElement.innerHTML = emailLink;
}

displayEmail();

function showRandomText(folder) {
    fetch(`${folder}/files.json`)
        .then(response => response.json())
        .then(data => {
            const randomFile = data.files[Math.floor(Math.random() * data.files.length)];

            fetch(`${folder}/${randomFile}`)
                .then(response => response.text())
                .then(data => {
                    const content = document.getElementById('content');
                    content.innerHTML = `<pre>${data}</pre>`;
                })
                .catch(error => {
                    console.error('텍스트 파일을 불러오는 데 문제가 발생했습니다:', error);
                });
        })
        .catch(error => {
            console.error('파일 목록을 불러오는 데 문제가 발생했습니다:', error);
        });
}
function showGrassPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
    <div id="grass-calendar-container" style="display: flex; justify-content: space-between; flex-shrink: 0; width: 100%;">
            <img src="images/grass.png" style="width: 60px; height: 60px; align-self: flex-end;">
            <div id="calendar" style="margin-left: 10px; align-self: flex-end;">
                <select id="year-dropdown"></select>
</div></div></div>
<div id="grass-container"></div>
        <h2>투두 리스트</h2><div id="memo-page"><div id="memo-input-section">
        <textarea id="memo-input" placeholder="입력하세요..."></textarea>
        <button id="add-memo-btn">입력</button>
    </div>
    <div id="memo-lists">
        <div class="memo-list" data-status="대기 중"><img src="images/elan_20189.png" style="width: 40px; height: 40px;"><p style="font-size: 14px;"><i>대기 중</p></i>
            <div class="memo-items"></div>
        </div>
        <div class="memo-list" data-status="진행 중"><img src="images/elan_20224.png" style="width: 40px; height: 40px;"><p style="font-size: 14px;"><i>진행 중</p></i>
            <div class="memo-items"></div>
        </div>
        <div class="memo-list" data-status="완료"><img src="images/elan_20226.png" style="width: 40px; height: 40px;"><p style="font-size: 14px;"><i>완료</p></i>
            <div class="memo-items"></div>
        </div>
    </div>
</div>
    `;

    populateYear();  
    showGrass('2025'); 
    initializeMemoPage();
}

function initializeMemoPage() {
    const memoInput = document.getElementById('memo-input');
    const addMemoBtn = document.getElementById('add-memo-btn');

    const lists = {
        '대기 중': document.querySelector('[data-status="대기 중"] .memo-items'),
        '진행 중': document.querySelector('[data-status="진행 중"] .memo-items'),
        '완료': document.querySelector('[data-status="완료"] .memo-items'),
    };

    const state = {
        '대기 중': [],
        '진행 중': [],
        '완료': [],
    };

    Object.keys(state).forEach(status => {
        const saved = JSON.parse(localStorage.getItem(status) || '[]');
        state[status] = saved;
        renderList(status);
    });

    addMemoBtn.addEventListener('click', () => {
        const text = memoInput.value.trim();
        if (!text) return;

        state['대기 중'].push(text);
        memoInput.value = '';
        saveState();
        renderList('대기 중');
    });

    function renderList(status) {
        lists[status].innerHTML = '';
        state[status].forEach((memo, index) => {
            const memoItem = document.createElement('div');
            memoItem.className = 'memo-item';
            memoItem.textContent = memo;
    
            const controls = document.createElement('div');
            controls.className = 'controls';
    
            if (status !== '대기 중') {
                const backBtn = document.createElement('button');
                backBtn.textContent = '◀';
    
                if (status === '완료') {
                    // 완료에서 ◀ 버튼을 누르면 진행 중으로 이동
                    backBtn.addEventListener('click', () => moveMemo(status, index, '진행 중'));
                } else {
                    // 대기 중과 진행 중에서는 각각 대기 중/진행 중으로 돌아감
                    backBtn.addEventListener('click', () => moveMemo(status, index, '대기 중'));
                }
    
                controls.appendChild(backBtn);
            }
    
            if (status !== '완료') {
                const forwardBtn = document.createElement('button');
                forwardBtn.textContent = '▶';
                forwardBtn.addEventListener('click', () => moveMemo(status, index, status === '대기 중' ? '진행 중' : '완료'));
                controls.appendChild(forwardBtn);
            }
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', () => deleteMemo(status, index));
            controls.appendChild(deleteBtn);
    
            memoItem.appendChild(controls);
            lists[status].appendChild(memoItem);
        });
    }
    

    function moveMemo(from, index, to) {
        const [movedMemo] = state[from].splice(index, 1);
        state[to].push(movedMemo);
        saveState();
        renderList(from);
        renderList(to);
    }

    function deleteMemo(status, index) {
        state[status].splice(index, 1);
        saveState();
        renderList(status);
    }

    function saveState() {
        Object.keys(state).forEach(status => {
            localStorage.setItem(status, JSON.stringify(state[status]));
        });
    }
}

function populateYear() {
    const yearDropdown = document.getElementById('year-dropdown');

    for (let year = 2025; year <= 2025; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    }
    yearDropdown.value = '2025'; 
    yearDropdown.addEventListener('change', () => {
        showGrass(yearDropdown.value); 
    });
}
function showGrass(year) {
    const grassContainer = document.getElementById('grass-container');
    grassContainer.innerHTML = ''; 
    let dayIndex = 0; 

    for (let month = 1; month <= 12; month++) {
        const filePath = `writing-data/${year}-${month}.json`;  
        console.log(`파일 경로: ${filePath}`); 
        
        fetch(filePath)
            .then(response => response.json())
            .then(monthData => {
                console.log(`${year}년 ${month}월 데이터:`, monthData); 
                
                const daysInMonth = new Date(year, month, 0).getDate();
                for (let day = 1; day <= daysInMonth; day++) {
                    const grassDiv = document.createElement('div');
                    grassDiv.classList.add('grass');
                    grassDiv.dataset.month = month;
                    grassDiv.dataset.day = day;

                    const newText = monthData[day] || 0;  
                    console.log(`${month}월 ${day}일 글자수: ${newText}`); 
                    const percentage = Math.min(Math.max(newText / 10000, 0), 1);

                    const red = Math.round(34 + (255 - 34) * (1 - percentage));
                    const green = Math.round(113 + (255 - 113) * (1 - percentage));
                    const blue = Math.round(49 + (255 - 49) * (1 - percentage));

                    grassDiv.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

                    const formattedDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const formattedText = `${formattedDate} ${newText.toLocaleString()}자`;

                    const tooltip = document.createElement('div');
                    tooltip.classList.add('tooltip');
                    tooltip.textContent = formattedText;

                    grassDiv.appendChild(tooltip);

                    const row = dayIndex % 7; 
                    const col = Math.floor(dayIndex / 7); 
                    grassDiv.style.gridRowStart = row + 1;
                    grassDiv.style.gridColumnStart = col + 1;

                    grassDiv.addEventListener('mouseenter', () => {
                        tooltip.style.visibility = 'visible';
                        tooltip.style.opacity = 1;
                    });
                    grassDiv.addEventListener('mouseleave', () => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = 0;
                    });
                    grassContainer.appendChild(grassDiv);
                    dayIndex++;  
                }
            })
            .catch(error => {
                console.error(`${year}년 ${month}월의 데이터를 불러오는 데 문제가 발생했습니다:`, error);
            });
    }
}

function loadBooksPage() {
    fetch('books.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data; 
        })
        .catch(error => {
            console.error('책 목록 페이지를 불러오는 데 문제가 발생했습니다:', error);
        });
}
