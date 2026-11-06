
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 80;
let vx = 180;
let vy = 140;
let r = 14;
let color = "#ffd166";

let last = performance.now();

// dtを使ってボールを動かす
function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
  }

  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
  }
}

// キーを押したときの処理
document.addEventListener("keydown", (e) => {
  if (e.repeat) return;

  // 上：速くする
  if (e.code === "ArrowUp") {
    vx = vx * 1.2;
    vy = vy * 1.2;
  }

  // 下：遅くする
  if (e.code === "ArrowDown") {
    vx = vx * 0.8;
    vy = vy * 0.8;
  }

  // 右：大きくする
  if (e.code === "ArrowRight") {
    r = Math.min(r + 2, 50);
  }

  // 左：小さくする
  if (e.code === "ArrowLeft") {
    r = Math.max(r - 2, 5);
  }

  // C：色を変える
  if (e.code === "KeyC") {
    if (color === "#ffd166") {
      color = "#06d6a0";
    } else if (color === "#06d6a0") {
      color = "#ef476f";
    } else {
      color = "#ffd166";
    }
  }
});

// ボールを描く
function draw() {
  // 前のボールを薄くして残像を作る
ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ゲームループ
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
