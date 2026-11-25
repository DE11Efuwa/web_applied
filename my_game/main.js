// 全体の流れ：毎回「動かす → 描く」をくり返す

// 役割ごとの「動かす」関数を呼ぶ
function update(dt) {
    if (gameState !== "play") {
    return;                 // プレイ中でなければ、動かさない
  }
  const prevBottom = player.y + player.h;   // 動かす前（前の回）の、プレイヤーの下の辺
  updatePlayer(dt);
  updateEnemies(dt);
  collideWithEnemies(prevBottom);
}

// 画面のまん中に文字を書く
function drawMessage(text, sub) {
  ctx.fillStyle = "#e8eeff";
  ctx.textAlign = "center";
  ctx.font = "32px sans-serif";
  ctx.fillText(text, canvas.width / 2, 150);
  ctx.font = "16px sans-serif";
  ctx.fillText(sub, canvas.width / 2, 190);
  ctx.textAlign = "left";   // ほかの文字のために戻す
  ctx.font = "14px monospace";
}
 
// 役割ごとの「描く」関数を呼ぶ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStage();
    if (gameState === "title") {
    drawMessage("my game", "Enter で始める");
    return;                 // タイトルでは、敵とプレイヤーは描かない
  }
  drawEnemies();
  drawPlayer();
    if (gameState === "pause") {
    drawMessage("PAUSE", "P でつづける");
  }
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);