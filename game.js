const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  }
};

const game = new Phaser.Game(config);

let hook;
let direction = 1;
let speed = 2;
let isDropping = false;
let trashItems = [];
let score = 0;
let scoreText;

function preload() {
  this.load.image('background', 'https://i.ibb.co/QX1ZKbC/underwater-bg.png');
  this.load.image('hook', 'https://i.ibb.co/ZzDvvmP/hook.png');
  this.load.image('trash1', 'https://i.ibb.co/YTRrkZ2/plastic-bottle.png');
  this.load.image('trash2', 'https://i.ibb.co/yPW6x12/plastic-bag.png');
}

function create() {
  this.add.image(400, 300, 'background');

  hook = this.physics.add.image(400, 100, 'hook');
  hook.setImmovable(true);

  // Rastgele çöp yerleştir
  for (let i = 0; i < 5; i++) {
    let type = Phaser.Math.Between(1, 2);
    let trash = this.physics.add.image(
      Phaser.Math.Between(100, 700),
      Phaser.Math.Between(300, 550),
      'trash' + type
    );
    trash.setData('collected', false);
    trashItems.push(trash);
  }

  // Skor
  scoreText = this.add.text(16, 16, 'Skor: 0', {
    fontSize: '24px',
    fill: '#ffffff'
  });

  this.input.on('pointerdown', () => {
    if (!isDropping) {
      isDropping = true;
    }
  });
}

function update() {
  if (!isDropping) {
    hook.x += speed * direction;
    if (hook.x > 780 || hook.x < 20) {
      direction *= -1;
    }
  } else {
    hook.y += 5;
    if (hook.y > 550) {
      hook.y = 100;
      isDropping = false;
    }

    trashItems.forEach(item => {
      if (!item.getData('collected') && Phaser.Math.Distance.Between(hook.x, hook.y, item.x, item.y) < 30) {
        item.setVisible(false);
        item.setData('collected', true);
        score += 10;
        scoreText.setText('Skor: ' + score);
        hook.y = 100;
        isDropping = false;
      }
    });
  }
}
