// script.js

// 버튼 클릭 이벤트 설정
document.getElementById('button1').addEventListener('click', showMain);
document.getElementById('button2').addEventListener('click', () => showRandomText('2'));
document.getElementById('button3').addEventListener('click', () => showRandomText('3'));

// 메인 화면 표시 함수
function showMain() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>안녕하세요!</h1>
        <p>여기는 내 웹사이트의 메인 화면입니다.</p>
    `;
}

// 랜덤 텍스트 파일 표시 함수
function showRandomText(folder) {
    // 폴더 내 텍스트 파일 이름 (미리 지정)
    const files = folder === '2' 
        ? ['file1.txt', 'file2.txt', 'file3.txt'] 
        : ['fileA.txt', 'fileB.txt', 'fileC.txt'];

    // 랜덤으로 파일 선택
    const randomFile = files[Math.floor(Math.random() * files.length)];

    // 텍스트 파일 읽어서 표시 (fetch 사용)
    fetch(`${folder}/${randomFile}`)
        .then(response => response.text())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = `<pre>${data}</pre>`;
        })
        .catch(error => {
            console.error('파일을 불러오는데 문제가 발생했습니다.', error);
        });
}
