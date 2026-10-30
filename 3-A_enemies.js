
// データ：敵のオブジェクトの配列
const enemies = [
  { name: "スライム", hp: 5 },
  { name: "ゴブリン", hp: 9 },
  { name: "ドラゴン", hp: 20 }
];

// データからリストを作る
function showEnemies() {
  const list = document.getElementById("enemyList");
  list.innerHTML = "";

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const li = document.createElement("li");

    li.innerText = `${enemy.name}（HP：${enemy.hp}）`;

    list.appendChild(li);
  }
}

// 攻撃：全員のHPを3減らして、リストを作り直す
function attack() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].hp -= 3;
  }

  showEnemies();
}

// 新しい敵を呼ぶ
function summonEnemy() {
  enemies.push({ name: "オーク", hp: 15 });

  showEnemies();
}

// 最初に敵のリストを表示する
showEnemies();
