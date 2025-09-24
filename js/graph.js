function createBarChart(ctx) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Photoshop','Illustrator','Figma','XD','Canva'],
      datasets: [{
        label: '熟練度',
        data: [4.5,4.8,4,3,3],
        backgroundColor: '#333',
      }]
    },
    options: {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false, // ← 追加！
  animation: { duration: 2000, easing: 'easeOutQuart' },
  scales: {
    x: {
      min: 0,
      max: 5,
      ticks: { stepSize: 1 },
      grid: { color: '#ddd' }
    },
    y: {
      ticks: { display: true },
      grid: { display: false }
    }
  },
  plugins: { legend: { display: false } }
}
  });
}

// スクロールで表示時にアニメーション
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !entry.target.dataset.loaded){
      entry.target.classList.add("active");
      createBarChart(document.getElementById("toolBarChart"));
      entry.target.dataset.loaded = true;
    }
  });
},{ threshold: 0.3 });

observer.observe(document.getElementById("chartRight"));
