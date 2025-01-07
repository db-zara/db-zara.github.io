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

    const filePath = `writing-data/${year}.json`;  
    console.log(`파일 경로: ${filePath}`); 

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            console.log('데이터:', data); 
            const yearData = data[year];

            let dayIndex = 0; 
            
            for (let month = 1; month <= 12; month++) {
                const monthData = yearData[month];  

                const daysInMonth = new Date(year, month, 0).getDate();

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
            }
        })
        .catch(error => {
            console.error('글자수 데이터를 불러오는 데 문제가 발생했습니다:', error);
        });
}
