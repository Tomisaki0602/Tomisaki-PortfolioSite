// 条件付きで実行したい処理
function runAfterLogoAnimation() {
  if (!window.isLogoAnimationFinished) {
    // ロゴアニメがまだ終わっていない場合、1秒ごとにチェック
    const interval = setInterval(() => {
      if (window.isLogoAnimationFinished) {
        clearInterval(interval);
        executeMyLogic(); // ロゴ終了後に実行する関数
      }
    }, 100);
  } else {
    // 既にロゴアニメ終了済みなら即実行
    executeMyLogic();
  }
}

// 実際の処理
function executeMyLogic() {
  // ここにJSの処理を書く
  console.log("ロゴアニメ後に動く処理が実行されました！");
}

// 使うとき
runAfterLogoAnimation();



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

(function(){
    const canvas = document.getElementById('radarCanvas');
    const tooltip = document.getElementById('tooltip');
    const ctx = canvas.getContext('2d');

    // --- Chart config & data (カスタマイズここから) ---
    let config = {
      levels: 5,             // グリッドの段数
      maxValue: 5,         // 最大値（自動計算したい場合は null に）
      labelFont: '12px system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
      animationDuration: 700 // ms
    };

    const labels = ['HTML', 'CSS', 'JavaScript', 'PHP', 'Design', 'Communication'];
    let datasets = [
      { name: 'スキル熟練度', color: '#4e4e4e', fill: 'rgba(68, 68, 68, 0.16)', values: [4, 5, 3, 3, 4, 3] },
    ];


    // dimension / retina scaling
    function resizeCanvas(){
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    }

    // calculate max from data if config.maxValue is null
    function calcMax(){
      if (config.maxValue) return config.maxValue;
      let max = 0;
      datasets.forEach(ds => ds.values.forEach(v => max = Math.max(max, v)));
      // round up to nice number
      const pow = Math.pow(10, Math.floor(Math.log10(max)));
      return Math.ceil(max / pow) * pow;
    }

    // get point coordinate (cx,cy center) for an axis index and value ratio (0..1)
    function polarToCartesian(cx, cy, radius, angleRad){
      return { x: cx + Math.cos(angleRad) * radius, y: cy + Math.sin(angleRad) * radius };
    }

    // draw function
    let animStart = null;
    let animProgress = 1; // 0..1
    let animate = true;

    function draw(timestamp){
      if (!timestamp) timestamp = performance.now();
      if (animate){
        if (!animStart) animStart = timestamp;
        const t = Math.min(1, (timestamp - animStart) / config.animationDuration);
        animProgress = easeOutCubic(t);
        if (t < 1) requestAnimationFrame(draw);
      } else {
        animProgress = 1;
      }

      // clear
      ctx.clearRect(0,0,canvas.width,canvas.height);

      const w = canvas.clientWidth, h = canvas.clientHeight;
      const cx = w/2, cy = h/2;
      const padding = 40;
      const radius = Math.min(w, h)/2 - padding;

      const levelCount = config.levels;
      const axisCount = labels.length;
      const maxVal = calcMax();

      // grid
      ctx.save();
      ctx.lineWidth = 1;
      for (let level=levelCount; level>=1; level--){
        const r = radius * (level/levelCount) * animProgress;
        ctx.beginPath();
        for (let i=0;i<axisCount;i++){
          const angle = (-Math.PI/2) + (i/axisCount)*Math.PI*2;
          const pt = polarToCartesian(cx, cy, r, angle);
          if (i===0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = level % 2 === 0 ? colorAlpha(getComputedStyle(document.documentElement).getPropertyValue('--grid') || '#223047', 0.8) : colorAlpha('#102033', 0.6);
        ctx.stroke();
      }

      // axis lines & labels
      ctx.font = config.labelFont;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i=0;i<axisCount;i++){
        const angle = (-Math.PI/2) + (i/axisCount)*Math.PI*2;
        const pt = polarToCartesian(cx, cy, radius * animProgress, angle);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pt.x, pt.y);
        ctx.strokeStyle = colorAlpha('#333', 0.15);
        ctx.stroke();

        // label position slightly beyond radius
        const labelPt = polarToCartesian(cx, cy, radius * 1.08 * animProgress, angle);
        // adjust label alignment by quadrant
        ctx.save();
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--label') || '#333';
        ctx.translate(labelPt.x, labelPt.y);
        // small offset for readability
        let align = 'center';
        let baseline = 'middle';
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(labels[i], 0, 0);
        ctx.restore();
      }

      // radial value numbers (on outermost polygon)
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#94a3b8';
      ctx.font = '11px system-ui, sans-serif';
      for (let level=1; level<=levelCount; level++){
        const v = Math.round(maxVal * (level/levelCount));
        const r = radius * (level/levelCount) * animProgress;
        const pt = polarToCartesian(cx, cy, r, -Math.PI/2);
        ctx.fillText(String(v), pt.x, pt.y + 12);
      }

      // draw datasets
      const allPoints = []; // for tooltip detection
      datasets.forEach((ds, dsIdx) => {
        ctx.beginPath();
        const points = [];
        for (let i=0;i<axisCount;i++){
          const val = ds.values[i] ?? 0;
          const ratio = Math.max(0, Math.min(1, val / maxVal)) * animProgress;
          const angle = (-Math.PI/2) + (i/axisCount)*Math.PI*2;
          const r = ratio * radius;
          const pt = polarToCartesian(cx, cy, r, angle);
          points.push(pt);
          if (i===0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        // fill
        ctx.fillStyle = ds.fill;
        ctx.strokeStyle = ds.color;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // points
        points.forEach((p, i)=>{
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
          ctx.fillStyle = ds.color;
          ctx.fill();
        });

        // save for tooltip / hit testing
        points.forEach((p, i)=>{
          allPoints.push({
            dsIndex: dsIdx,
            axisIndex: i,
            x: p.x,
            y: p.y,
            value: ds.values[i]
          });
        });
      });

      ctx.restore();

      // store points for external access (for hit testing)
      canvas._radarPoints = allPoints;
    }

    // helpers
    function colorAlpha(hexOrRgb, alpha){
      // loosely compute rgba from color string or hex
      if (!hexOrRgb) return `rgba(255,255,255,${alpha})`;
      if (hexOrRgb.startsWith('rgba')) return hexOrRgb.replace(/rgba\(([^)]+)\)/, (m, g)=> {
        const parts = g.split(',').map(s=>s.trim());
        parts[3] = alpha;
        return `rgba(${parts.join(',')})`;
      });
      if (hexOrRgb.startsWith('rgb')) return hexOrRgb.replace(/rgb\(([^)]+)\)/, (m, g)=> `rgba(${g},${alpha})`);
      // hex
      let hex = hexOrRgb.replace('#','').trim();
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

    // interaction: tooltip on hover near points
    function handleMouseMove(e){
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pts = canvas._radarPoints || [];
      let found = null;
      const hitRadius = 10;
      for (let p of pts){
        const dx = p.x - x, dy = p.y - y;
        if (dx*dx + dy*dy <= hitRadius*hitRadius){
          found = p; break;
        }
      }
      if (found){
        tooltip.style.display = 'block';
        tooltip.innerText = `${datasets[found.dsIndex].name} — ${labels[found.axisIndex]}: ${found.value}`;
        tooltip.style.left = `${found.x}px`;
        tooltip.style.top = `${found.y}px`;
      } else {
        tooltip.style.display = 'none';
      }
    }

    function handleMouseLeave(){ tooltip.style.display = 'none'; }

    function restartAnim(){
      animStart = null;
      if (animate) requestAnimationFrame(draw);
      else draw();
    }

    // mouse events
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);

    // initialize
    // set default canvas aspect ratio
    (function init(){
      // give canvas a default CSS height if none
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      // ensure container has height
      const wrap = document.querySelector('.chart-wrap');
      if (wrap.clientHeight < 360){
        wrap.style.minHeight = '420px';
      }
      resizeCanvas();
      requestAnimationFrame(draw);
    })();

    // expose some convenience functions (for dev / interactive use)
    window.radarChart = {
      updateData(newDatasets){
        datasets = newDatasets;
        animStart = null;
        requestAnimationFrame(draw);
      },
      updateLabels(newLabels){
        while(labels.length) labels.pop();
        newLabels.forEach(l=>labels.push(l));
        animStart = null;
        requestAnimationFrame(draw);
      }
    };
    // --- Intersection Observerで画面に入ったらアニメ開始 ---
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      restartAnim();
      // 1回だけ発火したい場合は下で監視解除
      observer.unobserve(canvas);
    }
  });
}, { threshold: 0.3 }); // 30%見えたら発火

observer.observe(canvas);


  })();