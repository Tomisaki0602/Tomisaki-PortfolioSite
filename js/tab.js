// フェードイン処理
function showElementAnimation(container = document) {
  var element = container.getElementsByClassName('fade-in');
  if (!element) return;
  var showTiming = window.innerHeight > 768 ? 200 : 60;
  var scrollY = window.pageYOffset;
  var windowH = window.innerHeight;
  for (var i = 0; i < element.length; i++) {
    var elemClientRect = element[i].getBoundingClientRect();
    var elemY = scrollY + elemClientRect.top;
    if (scrollY + windowH - showTiming > elemY) {
      element[i].classList.add('show');
    }
  }
}

// 初期実行 & スクロール時に実行
showElementAnimation();
window.addEventListener('scroll', () => showElementAnimation());

// タブ切り替え処理
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // タブ切り替え
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => {
      c.classList.remove('active');
      // ★ 一旦リセット
      c.querySelectorAll('.fade-in').forEach(el => {
        el.classList.remove('show');
      });
    });

    const target = document.getElementById(tab.dataset.tab);
    target.classList.add('active');

    // ★ 少し待ってから再度フェードイン実行
    setTimeout(() => {
      showElementAnimation(target);
    }, 50); // ← 50msくらい待つと確実に再発火
  });
});
