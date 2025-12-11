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
    
    handleBallCollision(ball) {
        if (ball.y + ball.radius > this.y &&
            ball.y + ball.radius < this.y + this.height &&
            ball.x + ball.radius > this.x &&
            ball.x - ball.radius < this.x + this.width &&
            ball.velocity.y > 0) {
            
            ball.velocity.y *= -1;
            
            const hitPoint = ball.x - (this.x + this.width / 2);
            ball.velocity.x = hitPoint * 0.15; // Factor de ángulo
            
            if (this.soundManager) {
             this.soundManager.playSound('bounce'); 
            }

            ball.y = this.y - ball.radius - 2; 
            
            return true;
        }
        return false;
    }
}