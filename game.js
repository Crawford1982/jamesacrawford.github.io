const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let character;
let cursors;
let axeGroup;
let patrolPoint1 = 300;
let patrolPoint2 = 500;


function preload() {
    this.load.image('sky', 'sky.png');
    this.load.spritesheet('character', 'character_spritesheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('axe', 'axe_spritesheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('background', 'background.png');
    this.load.image('ground', 'ground.png');
    this.load.spritesheet('enemy', 'enemy_spritesheet.png', { frameWidth: 32, frameHeight: 32 });

}

function create() {
    this.add.image(400, 300, 'sky');

    const backgroundWidth = this.textures.get('background').getSourceImage().width;

    for (let i = 0; i < (4800 / backgroundWidth) + 1; i++) {
        this.add.image(i * backgroundWidth, 0, 'background').setOrigin(0, 0);
    }

    

    const groundWidth = this.textures.get('ground').getSourceImage().width;
    const groundHeight = this.textures.get('ground').getSourceImage().height;
    const levelLength = 4800;

    const platforms = this.physics.add.staticGroup();

    // Create a long ground platform
    for (let i = 0; i < (levelLength / groundWidth) + 1; i++) {
        platforms.create(i * groundWidth, this.sys.game.config.height - groundHeight + 8, 'ground');
    }

    character = this.physics.add.sprite(100, 450, 'character');
    character.setBounce(0.2);
    character.setCollideWorldBounds(true);

    character.setDepth(1);

    this.physics.add.collider(character, platforms);

    // Set camera to follow the character and match the new level width
    this.cameras.main.setBounds(0, 0, levelLength, this.sys.game.config.height);
    this.cameras.main.startFollow(character);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('character', { start: 1, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'character', frame: 0 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('character', { start: 1, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'spin',
        frames: this.anims.generateFrameNumbers('axe', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    enemy = this.physics.add.sprite(400, 450, 'enemy');
enemy.setBounce(0.2);
enemy.setCollideWorldBounds(true);

this.physics.add.collider(enemy, platforms);

this.anims.create({
    key: 'enemyMove',
    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

enemy.anims.play('enemyMove', true);

enemy.setVelocityX(200); // You can adjust the speed as needed

 

    axeGroup = this.physics.add.group();

    this.input.keyboard.on('keydown_SPACE', function (event) {
        throwAxe(this);
    }, this);

    this.physics.add.overlap(axeGroup, enemy, killEnemy, null, this);

}


function update() {
    if (cursors.left.isDown) {
        character.setVelocityX(-160);
        character.flipX = true; // Flip the character horizontally when moving left
        character.anims.play('left', true);
    } else if (cursors.right.isDown) {
        character.setVelocityX(160);
        character.flipX = false; // Reset flip when moving right
        character.anims.play('right', true);
    } else {
        character.setVelocityX(0);
        character.anims.play('turn');
    }

    if (cursors.up.isDown && character.body.touching.down) {
        character.setVelocityY(-330);
    }

    // Add axe throwing
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        throwAxe(this);
    }

    // Enemy patrol code
    if (enemy.x <= patrolPoint1) {
        enemy.setVelocityX(100);
        enemy.flipX = false;
    } else if (enemy.x >= patrolPoint2) {
        enemy.setVelocityX(-100);
        enemy.flipX = true;
    }
}

function throwAxe(scene) {
    const axe = axeGroup.create(character.x, character.y, 'axe');
    axe.setBounce(0.6);
    axe.setCollideWorldBounds(true);
    axe.anims.play('spin', true);

    // Disable gravity for the axe
    axe.body.allowGravity = false;

    // Set the velocity based on the direction the character is facing
    if (character.flipX) {
        axe.setVelocityX(-300);
    } else {
        axe.setVelocityX(300);
    }

    // Destroy the axe after 1.5 seconds
    setTimeout(() => {
        axe.destroy();
    }, 1500);
}

function killEnemy(axe, enemy) {
    axe.disableBody(true, true);
    let deadCharacter = this.add.image(enemy.x, enemy.y, 'deadCharacter');
    deadCharacter.setDepth(1);
    enemy.disableBody(true, true);

    setTimeout(() => {
        deadCharacter.destroy();
        enemy.enableBody(true, enemy.x, enemy.y, true, true);
    }, 1000);
}
