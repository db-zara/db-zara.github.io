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
        <div id="calendar">
            <select id="year-dropdown"></select>
        </div>
        <div id="grass-container"></div>
    `;
    populateYear();  
    showGrass('2025'); 
}

function populateYear() {
    const yearDropdown = document.getElementById('year-dropdown');

    // 년도 설정 
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
    grassContainer.innerHTML = '';  // 기존 잔디를 비운다

    const filePath = `writing-data/${year}.json`;  // 해당 년도 데이터 경로
    console.log(`파일 경로: ${filePath}`); // 파일 경로 로그

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            console.log('데이터:', data); // 데이터 확인용 로그
            const yearData = data[year];

            // 잔디를 일별로 나열 (각 월의 일별 데이터를 모두 나열)
            let dayIndex = 0; // 0부터 시작해서 데이터 배열을 순차적으로 채운다.
            
            // 1월부터 12월까지 순차적으로 데이터를 배치한다.
            for (let month = 1; month <= 12; month++) {
                const monthData = yearData[month];  // 해당 월의 데이터

                // 해당 월의 실제 일 수를 구함 (예: 2월은 28일, 4월은 30일 등)
                const daysInMonth = new Date(year, month, 0).getDate();

                // 각 월의 일 수에 맞게 반복 (1일부터 해당 월의 마지막 일까지)
                for (let day = 1; day <= daysInMonth; day++) {
                    const grassDiv = document.createElement('div');
                    grassDiv.classList.add('grass');
                    grassDiv.dataset.month = month;
                    grassDiv.dataset.day = day;

                    const newText = monthData[day] || 0;  // 해당 일의 글자 수 (없으면 0)
                    console.log(`${month}월 ${day}일 글자수: ${newText}`); // 일별 글자 수 확인용 로그
                    const percentage = Math.min(Math.max(newText / 10000, 0), 1);

                    // 10000자일 때 rgb(34, 113, 49)로 고정하고, 그 이하일 때 연한 색
                    const red = Math.round(34 + (255 - 34) * (1 - percentage));
                    const green = Math.round(113 + (255 - 113) * (1 - percentage));
                    const blue = Math.round(49 + (255 - 49) * (1 - percentage));

                    grassDiv.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

                    // tooltip 텍스트 설정
                    const formattedDate = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const formattedText = `${formattedDate} ${newText.toLocaleString()}자`;
                    grassDiv.title = formattedText;  // title 속성에 설정

                    // 잔디의 위치를 지정
                    const row = dayIndex % 7;  // 행
                    const col = Math.floor(dayIndex / 7);  // 열
                    grassDiv.style.gridRowStart = row + 1;
                    grassDiv.style.gridColumnStart = col + 1;

                    grassContainer.appendChild(grassDiv);
                    dayIndex++;  // 다음 위치로 이동
                }
            }
        })
        .catch(error => {
            console.error('글자수 데이터를 불러오는 데 문제가 발생했습니다:', error);
        });
}
