
const CONFIG = {
  GRAVITY: 1800,
  JUMP_SPEED: 950,
  MOVE_SPEED: 280,
  MAX_JUMPS: 2,
  FALL_GRAVITY_RATE: 2,
};

const player = {
  x: 80,
  y: 20,
  w: 32,
  h: 32,
  vy: 0,
  isGrounded: false,
  jumpsLeft: CONFIG.MAX_JUMPS
};

const keys = {};

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let lastTime = 0;

// キーを押したとき
function keydown(e) {
  keys[e.code] = true;

  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -CONFIG.JUMP_SPEED;
    player.jumpsLeft--;
  }
}

// キーを離したとき
function keyup(e) {
  keys[e.code] = false;
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

// 床との当たり判定
function collideWithFloor() {
  const floorY = canvas.height - 32;

  if (player.y + player.h >= floorY) {
    player.y = floorY - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = CONFIG.MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

// ゲームの更新
function update(dt) {

  // 左右の移動
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    player.x -= CONFIG.MOVE_SPEED * dt;
  }

  if (keys["ArrowRight"] || keys["KeyD"]) {
    player.x += CONFIG.MOVE_SPEED * dt;
  }

  // 画面の外に出ないようにする
  player.x = Math.max(
    0,
    Math.min(canvas.width - player.w, player.x)
  );

  // 落ちているときだけ重力を強くする
  const g = player.vy > 0
    ? CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE
    : CONFIG.GRAVITY;

  player.vy = player.vy + g * dt;

  // Y座標を更新
  player.y = player.y + player.vy * dt;

  collideWithFloor();
}

// 画面を描く
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const floorY = canvas.height - 32;

  // 床を描く
  ctx.fillStyle = "gray";
  ctx.fillRect(0, floorY, canvas.width, 32);

  // 床から64px上に赤い目印の線を描く
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, floorY - 64);
  ctx.lineTo(canvas.width, floorY - 64);
  ctx.stroke();

  // プレイヤーを描く
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 数値を表示
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.fillText(
    "vy = " + player.vy.toFixed(0) +
    "   jumpsLeft = " + player.jumpsLeft,
    10,
    20
  );
}

// ゲームループ
function loop(timestamp) {
  const dt = lastTime
    ? Math.min((timestamp - lastTime) / 1000, 0.05)
    : 0;

  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
