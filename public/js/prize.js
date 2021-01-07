const urlAPI = '/getprize';
const errMessage = '系統不穩定，請再試一次';

// 拿得到的文字和圖片渲染畫面
function renderResult(name, description, imgSrc) {
  const container = document.querySelector('.prize');
  // 把原畫面隱藏
  container.querySelector('.prize__wrap').classList.add('hide');
  // 背景圖片更換
  container.style.cssText = `background-image: linear-gradient(rgba(0, 0 , 0, 0.5), rgba(0, 0 , 0, 0.5)), url(${imgSrc});`
  // container.classList.add(`prize__${imgSrc.toLowerCase()}`);
  // 把文字加到畫面上
  const div = document.createElement('div');
  div.classList.add('prize__result');
  div.innerHTML = `
      <h1 class="prize__result-title">${name}</h1>
      <h3 class="prize__result-title">${description}</h3>
    <div class="prize__btn" onclick="javascript: window.location.reload()">
      我要抽獎
    </div>
  `;
  container.appendChild(div);
}

// 得到的結果與對應的文字和圖片
function getResult(result) {
  renderResult(result.name, result.description, result.imgLink)
}

// 拿 API
function getPrize(fn) {
  const request = new XMLHttpRequest();
  request.open('GET', urlAPI, true);

  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      let result;
      try {
        result = JSON.parse(request.responseText).prize;
      } catch (e) {
        alert(errMessage);
        return;
      }
      fn(result);
    } else {
      alert(errMessage);
    }
  };
  request.send();
}

// 點 button 監聽事件
document.querySelector('.prize__btn').addEventListener('click', () => {
  getPrize(getResult);
  // 跳到新的一頁時去頁面最上方
  window.scrollTo(0, 0);
});
