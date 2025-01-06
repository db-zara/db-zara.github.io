document.getElementById('button1').addEventListener('click', showMain);
document.getElementById('button2').addEventListener('click', () => showRandomText('2'));
document.getElementById('button3').addEventListener('click', () => showRandomText('3'));

// 메인 화면 표시 함수
function showMain() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <p>소개소개</p>
    `;
}

function showRandomText(folder) {
    const files = folder === '2' 
        ? ['file1.txt', 'file2.txt', 'file3.txt'] 
        : ['file1.txt', 'file2.txt', 'file3.txt'];

    const randomFile = files[Math.floor(Math.random() * files.length)];

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
