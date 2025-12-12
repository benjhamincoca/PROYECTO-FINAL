class Paddle {
    width = 120;
    height = 20;
    speed = 10;
    moveLeft = false;
    moveRight = false;

    constructor(canvasWidth, canvasHeight, soundManagerInstance) {
        this.canvasWidth = canvasWidth;
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - 80;
        this.soundManager = soundManagerInstance;
    }

    draw(ctx) {
        ctx.fillStyle = "#00c49a"; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Lógica de movimiento para teclado
    update() {
        if (this.moveLeft) {
            this.x -= this.speed;
        }
        if (this.moveRight) {
            this.x += this.speed;
        }

        // Límites
        if (this.x < 60) this.x = 60;
        if (this.x + this.width > this.canvasWidth - 60) {
            this.x = this.canvasWidth - 60 - this.width;
        }
    }

    setMovement(direction, isMoving) {
        if (direction === 'left') this.moveLeft = isMoving;
        if (direction === 'right') this.moveRight = isMoving;
    }
    
   // paddle.js - handleBallCollision (CORRECCIÓN MENOR DE ORDEN)
  // paddle.js - handleBallCollision (CORRECCIÓN MENOR DE ORDEN)
    handleBallCollision(ball) {
        if (ball.y + ball.radius > this.y &&
            ball.y + ball.radius < this.y + this.height &&
            ball.x + ball.radius > this.x &&
            ball.x - ball.radius < this.x + this.width &&
            ball.velocity.y > 0) {
            
            // 1. Cambios de movimiento
            ball.velocity.y *= -1;
            const hitPoint = ball.x - (this.x + this.width / 2);
            ball.velocity.x = hitPoint * 0.15; 
            
            // 2. Reposicionamiento de la pelota para evitar que se pegue
            ball.y = this.y - ball.radius - 2; 
            
            // 3. LLAMADA AL SONIDO (Última acción crítica del bloque)
            if (this.soundManager) {
            this.soundManager.playSound('bounce'); 
            }

            return true;
        }
        return false;
    }

    // paddle.js - Añadir este método a la clase Paddle

    reset() {
        // Centra la paleta
        this.x = (this.canvasWidth / 2) - (this.width / 2);
        // Reinicia el movimiento
        this.moveLeft = false;
        this.moveRight = false;
    }
}