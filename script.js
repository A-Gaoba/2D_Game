window.addEventListener("load", () => {
  // canvas setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (event) => {
        if (
          (event.key === "ArrowUp" || event.key === "ArrowDown") &&
          this.game.keys.indexOf(event.key) === -1
        ) {
          this.game.keys.push(event.key);
        } else if (event.key === " ") {
          this.game.Player.shootTop();
        }
      });
      window.addEventListener("keyup", () => {
        if (this.game.keys.indexOf(event.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(event.key), 1);
        }
      });
    }
  }
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) {
        this.markForDeletion = true;
      }
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  class Particle {}
  class Player {
    constructor(game) {
      // copy of game object to allow to player to access to the properties that player need
      // like width and height and others that be stored in main Game object
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20; // start an horizontal x coordinate
      this.y = 100; // vertical y
      this.speedY = 0; // 0 means that ther is no vertical movment
      this.maxSpeed = 5;
      this.Projectiles = [];
    }

    // this method to move the player
    update() {
      if (this.game.keys.includes("ArrowUp")) {
        this.speedY = -this.maxSpeed;
      } else if (this.game.keys.includes("ArrowDown")) {
        this.speedY = this.maxSpeed;
      } else {
        this.speedY = 0;
      }
      this.y += this.speedY;

      //handle projectiles
      this.Projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.Projectiles.filter((projectile) => {
        !projectile.markForDeletion;
      });
    }

    // this method to draw the graphics represent in the player
    draw(context) {
      context.fillStyle = "black";
      // drawing rectangle at Player current X and Y position
      context.fillRect(this.x, this.y, this.width, this.height);
      this.Projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.Projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markForDeletion = false;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) {
        this.markForDeletion = true;
      }
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228 * 0.2;
      this.height = 169 * 0.2;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
  }
  class Layer {}
  class Background {}
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "";
      this.color = "yellow";
    }
    draw(context) {
      // ammo
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i, 50, 3, 20);
      }
    }
  }
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.Player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.ammo = 20; // Number of ammo
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoIntervel = 500;
      this.gameOver = false;
    }
    update(deltaTime) {
      // update player
      this.Player.update();
      if (this.ammoTimer > this.ammoIntervel) {
        if (this.ammo < this.maxAmmo) {
          this.ammo++;
        }
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update();
      });
      this.enemies = this.enemies.filter((enemy) => {
        !enemy.markForDeletion;
      });
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      // draw player
      this.Player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }
    addEnemy() {
      this.enemies.push(new Angler1(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  // animation loop to run and update and draw methods over and over
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    // tells the browser that we  an animation
    requestAnimationFrame(animate);
  }
  animate(0);
});
