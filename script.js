document.getElementById('button1').addEventListener('click', showMain);
document.getElementById('button2').addEventListener('click', () => showRandomText('2'));
document.getElementById('button3').addEventListener('click', () => showRandomText('3'));
document.getElementById('button4').addEventListener('click', showGrassPage);

function showMain() {
    window.location.reload();  
}

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
        <div id="calendar"><select id="year-dropdown"></select></div><div id="grass-container"></div>
    <div id="memo-container">
    <textarea id="memo-input" placeholder="메모를 작성하세요..."></textarea>
    <div id="memo-buttons">
        <button id="save-memo-btn">저장</button>
    </div>
</div>
<div id="memo-list"></div>

    `;
    populateYear();  
    showGrass('2025'); 
    addMemoFunctionality();
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

    // 각 월별 데이터를 처리하는 순서를 바꿔줍니다.
    // 순서대로 월을 처리할 수 있도록 수정
    for (let month = 1; month <= 12; month++) {
        const filePath = `writing-data/${year}-${month}.json`;  
        console.log(`파일 경로: ${filePath}`); 
        
        fetch(filePath)
            .then(response => response.json())
            .then(monthData => {
                console.log(`${year}년 ${month}월 데이터:`, monthData); 
                
                // 해당 월의 일별 데이터를 처리
                const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 일 수
                for (let day = 1; day <= daysInMonth; day++) {
                    const grassDiv = document.createElement('div');
                    grassDiv.classList.add('grass');
                    grassDiv.dataset.month = month;
                    grassDiv.dataset.day = day;

                    const newText = monthData[day] || 0;  // 해당 일의 글자 수 (없으면 0)
                    console.log(`${month}월 ${day}일 글자수: ${newText}`); // 일별 글자 수 확인용 로그
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

                    // **이 부분 수정**
                    // 월별로 데이터를 세로로 나열할 수 있도록 그리드 스타일 적용 (행과 열을 구분)
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
function addMemoFunctionality() {
    document.getElementById('save-memo-btn').addEventListener('click', saveMemo);
    document.getElementById('memo-input').addEventListener('input', updateMemoList);

    function saveMemo() {
        const memoInput = document.getElementById('memo-input');
        const memoText = memoInput.value.trim();

        if (memoText === '') return; 

        let memos = getMemosFromLocalStorage(); 
        memos.push({ text: memoText, checked: false }); 

        saveMemosToLocalStorage(memos);
        memoInput.value = ''; 
        updateMemoList(); 
    }

    function getMemosFromLocalStorage() {
        const memos = localStorage.getItem('memos');
        return memos ? JSON.parse(memos) : [];
    }

    function saveMemosToLocalStorage(memos) {
        localStorage.setItem('memos', JSON.stringify(memos));
    }

    function updateMemoList() {
        const memoList = document.getElementById('memo-list');
        memoList.innerHTML = ''; 

        const memos = getMemosFromLocalStorage(); 
        memos.forEach((memo, index) => {
            const memoItem = document.createElement('div');
            memoItem.classList.add('memo-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('checkbox');
            checkbox.checked = memo.checked;
            checkbox.addEventListener('change', () => toggleMemoCheck(index));

            const memoText = document.createElement('span');
            memoText.textContent = memo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.addEventListener('click', () => deleteMemo(index));

            memoItem.appendChild(checkbox);
            memoItem.appendChild(memoText);
            memoItem.appendChild(deleteBtn);

            memoList.appendChild(memoItem);
        });
    }

    function toggleMemoCheck(index) {
        let memos = getMemosFromLocalStorage();
        memos[index].checked = !memos[index].checked;
        saveMemosToLocalStorage(memos);
        updateMemoList(); 
    }

    function deleteMemo(index) {
        let memos = getMemosFromLocalStorage();
        memos.splice(index, 1); 
        saveMemosToLocalStorage(memos);
        updateMemoList(); 
    }

    document.addEventListener('DOMContentLoaded', updateMemoList);
}
