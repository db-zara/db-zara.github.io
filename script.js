// 메인 페이지를 보여주는 함수
function showMainPage() {
    const content = document.getElementById('content');
    content.innerHTML = `<h1>내 소개</h1><p>여기에 내 소개 내용을 입력해 주세요.</p>`;
  }
  
  // 랜덤 텍스트 파일 표시 함수
  function showRandomText(folder) {
    const jsonUrl = `${folder}.json`; 
    
    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => {
        const randomFile = data.files[Math.floor(Math.random() * data.files.length)];
  
        // 파일 내용 가져오기
        fetch(`${folder}/${randomFile}`)  // 폴더에서 랜덤 파일 읽기
          .then(response => response.text())
          .then(fileContent => {
            const content = document.getElementById('content');  // 'content'라는 ID를 가진 요소에 내용 넣기
            content.innerHTML = `<pre>${fileContent}</pre>`;  // 파일 내용 표시
          })
          .catch(error => {
            console.error('파일을 불러오는 데 문제가 발생했습니다.', error);
          });
      })
      .catch(error => {
        console.error('JSON 파일을 불러오는 데 문제가 발생했습니다.', error);
      });
  }
  
  // 버튼 클릭 이벤트 처리
  document.getElementById('button1').addEventListener('click', function() {
    showMainPage();  // 메인 페이지 표시
  });
  
  document.getElementById('button2').addEventListener('click', function() {
    showRandomText('2');  // '2' 폴더에서 랜덤 텍스트 파일 가져오기
  });
  
  document.getElementById('button3').addEventListener('click', function() {
    showRandomText('3');  // '3' 폴더에서 랜덤 텍스트 파일 가져오기
  });
  