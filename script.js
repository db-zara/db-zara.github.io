document.getElementById('button1').addEventListener('click', showMain);
document.getElementById('button2').addEventListener('click', () => showRandomText('2'));
document.getElementById('button3').addEventListener('click', () => showRandomText('3'));

// 메인 화면 표시 함수
function showMain() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>공사중</h1>
        <p>안녕하세요. 고수진입니다. ㄱ-
            <br>상단 단추를 눌러 이동할 수 있습니다.
            <br>두 번째 단추를 누르면 일기가, 세 번째 단추를 누르면 필사한 내용이 랜덤으로 창에 나타납니다. 마음껏 보셔도 좋으나 일기 속 문장은 웬만하면 가져가지 말아주세요. (저도 나중에 써먹어야 해서;;OTL)
            <br>찾아주셔서 고맙습니다.
            <br>죤 하루 되시길요. ^^
        </p>
    `;
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
