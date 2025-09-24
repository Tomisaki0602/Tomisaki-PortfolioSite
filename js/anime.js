window.addEventListener("load", () => {
  const glasses = document.querySelector('.glasses');
  const mustache = document.querySelector('.mustache');
  const beard = document.querySelector('.beard');
  const loader = document.getElementById("loader");

  // 最後のパーツ(beard)アニメ開始 + アニメ時間 + 表示保持
  const totalTime = 1.2 + 0.8 + 0.5; // beardのdelay + animation + 1.5秒保持
  setTimeout(() => {
    // 全パーツの最終位置に揃える
    glasses.style.transform = `translateY(0px)`;
    mustache.style.transform = `translateY(0px)`;
    beard.style.transform = `translateY(0px)`;

    // 全体フェードアウト
    loader.style.transition = "opacity 0.8s ease";
    loader.style.opacity = 0;
    setTimeout(() => loader.style.display = "none", 800);

    // --- ロゴアニメ終了後に各テキストアニメ処理を呼ぶ ---
    if (typeof EachTextAnimeControl === "function") {
      // span追加などの初期処理
      $(".eachTextAnime").each(function () {
        var text = $(this).text();
        var textbox = "";
        text.split("").forEach(function (t, i) {
          if (t !== " ") {
            var delay = i < 10 ? "." + i : i / 10;
            textbox += '<span style="animation-delay:' + delay + 's;">' + t + '</span>';
          } else {
            textbox += t;
          }
        });
        $(this).html(textbox);
      });

      // 初回表示チェック
      EachTextAnimeControl();

      // スクロール監視
      $(window).scroll(function () {
        EachTextAnimeControl();
      });
    }

  }, totalTime * 1000);
});
