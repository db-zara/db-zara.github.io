document.getElementById('button1').addEventListener('click', showMain);
document.getElementById('button2').addEventListener('click', () => showRandomText('2'));
document.getElementById('button3').addEventListener('click', () => showRandomText('3'));

// 메인 화면 표시 함수
function showMain() {
    const content = document.getElementById('content');
    fetch('intro.txt')
        .then(response => response.text())
        .then(data => {
            content.innerHTML = `<p>${data}</p>`;
        })
        .catch(error => {
            console.error('파일을 불러오는데 문제가 발생했습니다.', error);
        });
}

function showRandomText(folder) {
    // 폴더에 맞는 files.json 파일을 가져옵니다.
    fetch(`${folder}/files.json`)
        .then(response => response.json())  // JSON 형식으로 변환
        .then(data => {
            const randomFile = data.files[Math.floor(Math.random() * data.files.length)];

            // 랜덤으로 선택된 파일을 가져옵니다.
            fetch(`${folder}/${randomFile}`)
                .then(response => response.text())
                .then(data => {
                    const content = document.getElementById('content');
                    content.innerHTML = `<pre>${data}</pre>`;
                })
                .catch(error => {
                    console.error('텍스트 파일을 불러오는 데 문제가 발생했습니다.', error);
                });
        })
        .catch(error => {
            console.error('파일 목록을 불러오는 데 문제가 발생했습니다.', error);
        });
}
