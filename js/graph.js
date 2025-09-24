let radarChart, barChart;

const radarData = {
  labels: ['HTML', 'CSS', 'JavaScript', 'PHP', 'デザイン'],
  datasets: [{
    label: 'スキルレベル',
    data: [5, 4, 2, 2, 3],
    backgroundColor: 'rgba(78, 78, 78, 0.2)',
    borderColor: '#4e4e4e',
    borderWidth: 2,
    pointBackgroundColor: '#4e4e4e'
  }]
};

const barData = {
  labels: ['Photoshop','Illustrator','Figma','XD','Canva'],
  datasets: [{
    label: '熟練度',
    data: [4, 5, 4, 3, 2],
    backgroundColor: '#4e4e4e'
  }]
};

const optionsRadar = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: '#4e4e4e' },
      grid: { color: '#4e4e4e' },
      suggestedMin: 0,
      suggestedMax: 5,
      ticks: { stepSize: 1 } // 整数刻み
    }
  },
  plugins: { legend: { display: false } }
};

const optionsBar = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y', // 横棒グラフ
  scales: {
    x: { beginAtZero: true, max: 5, ticks: { color: '#4e4e4e', stepSize: 1 } },
    y: { ticks: { color: '#4e4e4e' } }
  },
  plugins: { legend: { display: false } }
};

// IntersectionObserverで画面に入ったら描画
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.id === 'radarBox' && !radarChart) {
        const radarCtx = document.getElementById('radarChart').getContext('2d');
        radarChart = new Chart(radarCtx, { type: 'radar', data: radarData, options: optionsRadar });
      }

      if (entry.target.id === 'barBox' && !barChart) {
        const barCtx = document.getElementById('barChart').getContext('2d');
        barChart = new Chart(barCtx, { type: 'bar', data: barData, options: optionsBar });
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.chart-box').forEach(box => observer.observe(box));

// ウィンドウリサイズ時にチャートを自動調整
window.addEventListener('resize', () => {
  if (radarChart) radarChart.resize();
  if (barChart) barChart.resize();
});