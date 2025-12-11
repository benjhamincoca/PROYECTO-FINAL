// PADDLE.JS

class Paddle {
    // Propiedades
    x;
    y;
    width = 120; // Ancho estándar de la barra
    height = 10; // Altura estándar
    speed = 7; // Velocidad de movimiento en píxeles
    
    // Estado de movimiento
    moveLeft = false;
    moveRight = false;
    
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        // Posición inicial: Centrado y cerca del fondo (30px de margen)
        this.x = (canvasWidth / 2) - (this.width / 2);
        this.y = canvasHeight - this.height - 30; 
    }

    draw(ctx) {
        // En el juego final, aquí usaríamos una imagen (ej: this.images[1])
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    update() {
        // Mueve la barra de forma continua
        if (this.moveLeft) {
            this.x -= this.speed;
        } else if (this.moveRight) {
            this.x += this.speed;
        }

        // Limita la barra a los bordes
        if (this.x < 60) { // Limitado al muro izquierdo (60px)
            this.x = 60;
        }
        if (this.x + this.width > this.canvasWidth - 60) { // Limitado al muro derecho (960-60)
            this.x = this.canvasWidth - 60 - this.width;
        }
    }
    
    // Método para la entrada de control (teclado/Dobot)
    setMovement(direction, isMoving) {
        if (direction === 'left') {
            this.moveLeft = isMoving;
        } else if (direction === 'right') {
            this.moveRight = isMoving;
        }
    }
    
    // LÓGICA CLAVE: REBOTE VARIABLE
    handleBallCollision(ball) {
        // ... (Implementación de Colisión ya detallada en la respuesta anterior)
        // La lógica de rebote variable asegura que la pelota no caiga en patrones.
        // Si la pelota está "pegada" y se mueve con la barra, se debe evitar el rebote.
        if (ball.velocity.y > 0 && 
            ball.x > this.x && ball.x < this.x + this.width &&
            ball.y + ball.radius > this.y && ball.y + ball.radius < this.y + this.height + ball.radius) {
            
            // 1. Calcula posición relativa (-1 a 1)
            const relativeX = (ball.x - (this.x + this.width / 2)) / (this.width / 2);
            
            // 2. Invierte la dirección vertical
            ball.velocity.y = -ball.velocity.y;
            
            // 3. Ajusta la velocidad horizontal (ángulo) basado en el impacto
            const angleFactor = 5; // Sensibilidad del rebote (ajustar para jugabilidad)
            ball.velocity.x = relativeX * angleFactor;

            // 4. Mueve la pelota fuera de la barra para evitar doble colisión
            ball.y = this.y - ball.radius - 1; 

            // 5. Normalizar la velocidad (mantener la magnitud constante)
            const magnitude = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
            const desiredSpeed = 3; // Velocidad de juego constante (ajustar)
            
            const ratio = desiredSpeed / magnitude;
            ball.velocity.x *= ratio;
            ball.velocity.y *= ratio;
            
            return true;
        }
        return false;
    }
}