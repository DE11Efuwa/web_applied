// 敵：作る・入れる・動かす・描く（足すものの形）
const MAX_ENEMIES = 6;   // 敵は、同時にこの数まで
 
// ① 作る：敵を1体作って返す関数（呼ぶたびに、新しい敵が1体できる）
function createEnemy(x, vx) {
  return { x: x, y: floor.y - 32, w: 32, h: 32, vx: vx, alive: true };
}

// ② 入れる：敵をまとめて入れる配列（７-６で入れ直すので let）
let enemies = [];
let spawnTimer = 0;   // 敵を出すタイマー
let nextSpawn = 2;    // 次の敵を出すまでの時間（秒）
// 最初の敵を入れ直す（★ main.js の resetGame から呼ばれる）
function resetEnemies() {
  enemies = [];
  enemies.push(createEnemy(200, 80));
  enemies.push(createEnemy(380, -120));
  enemies.push(createEnemy(540, 60));
  // 気まぐれな敵を追加
const special = createEnemy(300, 100);
special.type = "random";
special.timer = 0;
special.changeTime = 1;
enemies.push(special);
  // ↑ 授業でくじの敵を足した人は、その行（const special = … から enemies.push(special); まで）もここへ
spawnTimer = 0;
nextSpawn = 2;
}

// 敵を時間で出す（タイマーの形・くり返す）
function spawnEnemies(dt) {
  spawnTimer = spawnTimer + dt;
  if (spawnTimer >= nextSpawn) {
    if (enemies.length < MAX_ENEMIES) {
      // 左の端か右の端か、くじで決める
      if (Math.random() < 0.5) {
        enemies.push(createEnemy(0, 100));                    // 左の端から、右へ
      } else {
        enemies.push(createEnemy(canvas.width - 32, -100));   // 右の端から、左へ
      }
    }
    spawnTimer = 0;
    nextSpawn = 1 + Math.random() * 2;   // 次は 1〜3 秒のどれか
  }
}


// ③ 動かす：配列の敵を1体ずつ取り出して、同じ処理をする
function updateEnemies(dt) {
  for (const enemy of enemies) {
        // 気まぐれな敵だけの処理
    if (enemy.type === "random") {
      enemy.timer = enemy.timer + dt;

      if (enemy.timer >= enemy.changeTime) {
        enemy.vx = -enemy.vx;
        enemy.timer = 0;
        enemy.changeTime = 1 + Math.random() * 2;
      }
    }
    enemy.x = enemy.x + enemy.vx * dt;
    // 端を越えたら、位置を戻して、向きを反対に（５-４の跳ね返り）
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }
    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }
  }
}

// プレイヤーとぶつかったとき：上から落ちてきたら敵を倒す
function collideWithEnemies(prevBottom) {
  const stompedEnemies = [];
  let hitSide = false;

  // まず、すべての敵との当たり判定を調べる
  for (const enemy of enemies) {
    if (aabb(player, enemy)) {
      if (prevBottom <= enemy.y && player.vy > 0) {
        stompedEnemies.push(enemy);
      } else {
        hitSide = true;
      }
    }
  }

  // 踏んだ敵があれば、すべて倒す
  if (stompedEnemies.length > 0) {
    for (const enemy of stompedEnemies) {
      enemy.alive = false;
      score = score + 1;
    }

    player.vy = -JUMP_SPEED / 2;
  }
  // 踏んでいない場合だけHPを減らす
  else if (hitSide && player.hitTimer <= 0) {
    player.hp = player.hp - 1;
    player.hitTimer = HIT_TIME;
  }

  // 生きている敵だけを残す
  enemies = enemies.filter((enemy) => enemy.alive);
}

// ④ 描く：配列の敵を1体ずつ取り出して描く
function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.type === "random") {
      ctx.fillStyle = "#9b59b6";
    } else {
      ctx.fillStyle = "#ff6b6b";
    }
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }
  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}