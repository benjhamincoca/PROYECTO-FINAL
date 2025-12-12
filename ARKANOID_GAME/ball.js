// BALL.JS

class Ball {
    x;
    y;
    radius = 3; // Radio pequeño para un mejor control
    color = "#FFD700"; // Oro/Amarillo
    
    velocity = { x: 0, y: 0 };
    isStuck = true; 

    constructor(startX, startY, radius, paddle, cellSize, soundManagerInstance) {
        this.radius = radius;
        this.paddle = paddle;
        this.cellSize = cellSize;
        this.soundManager = soundManagerInstance;
        
        // Inicializa la pelota pegada a la barra
        this.x = paddle.x + (paddle.width / 2);
        this.y = paddle.y - radius;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

  // BALL.JS (MÉTODO update CORREGIDO)

    update(canvasWidth, canvasHeight) {
        // 1. Si está pegada, sigue a la barra
        if (this.isStuck) {
            this.x = this.paddle.x + (this.paddle.width / 2);
            this.y = this.paddle.y - this.radius;
            return; // No hay necesidad de procesar colisiones si está pegada
        }

        // 2. Mueve la pelota
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 3. Colisión con Muros y Detección de Caída (¡La corrección es aquí!)
        // Devolvemos el resultado de handleWallCollision (que puede ser 'LOST_LIFE' o null)
        return this.handleWallCollision(canvasWidth, canvasHeight); 
    }
    
    // ball.js - Método handleWallCollision CORREGIDO

    handleWallCollision(canvasWidth, canvasHeight) {
        let bounced = false;

        // 1. Reversa X en paredes laterales (Límites: 60 y canvasWidth - 60)
        if (this.x - this.radius < 60 || this.x + this.radius > canvasWidth - 60) {
            this.velocity.x = -this.velocity.x;
            
            // CORRECCIÓN TUNNELING LATERAL: Reposicionamiento forzado
            if (this.x - this.radius < 60) {
                this.x = 60 + this.radius; 
            } else if (this.x + this.radius > canvasWidth - 60) {
                this.x = canvasWidth - 60 - this.radius;
            }
            
            bounced = true;
        }
        
        // 2. Reversa Y en el techo (Límite: 60)
        // ⚠️ ESTA PARTE FALTABA EN TU CÓDIGO ANTERIOR ⚠️
        if (this.y - this.radius < 60) {
            this.velocity.y = -this.velocity.y;
            
            // CORRECCIÓN TUNNELING SUPERIOR: Fija la posición justo debajo del límite (60)
            this.y = 60 + this.radius; 
            
            bounced = true;
        }
        // ----------------------------------------------------
        
        // NOTA: Se omite la llamada a soundManager.playSound('bounce') para pared/techo,
        // ya que el sonido de rebote se centralizó en la colisión con los ladrillos.
        
        // PERDIDA DE VIDA (Se procesa en Game.js)
        // Si cae por debajo, se detiene y se pega a la barra
        if (this.y + this.radius > canvasHeight) {
            this.isStuck = true;
            this.velocity.x = 0;
            this.velocity.y = 0;
            return 'LOST_LIFE'; // Señal para Game.js
        }
        
        return null;
    }
    launch(initialSpeed) {
        if (this.isStuck) {
            this.isStuck = false;
            // Da un ángulo aleatorio inicial hacia arriba para evitar el eje vertical perfecto
            const angle = Math.PI * 0.75 + (Math.random() * Math.PI * 0.5); // Entre 135 y 225 grados
            
            this.velocity.x = initialSpeed * Math.cos(angle);
            this.velocity.y = initialSpeed * Math.sin(angle);
        }
    }

    // ball.js - Nuevo Método

    /** Reposiciona la pelota en el centro de la paleta */
    resetToPaddle() {
        // Calcula el centro de la paleta
        this.x = this.paddle.x + (this.paddle.width / 2);
        // Coloca la pelota justo encima de la paleta
        this.y = this.paddle.y - this.radius;
        // Detiene cualquier velocidad residual
        this.velocity.x = 0;
        this.velocity.y = 0;
        
        // 💡 AJUSTE CRÍTICO: Aseguramos que está lista para ser lanzada 💡
        this.isStuck = true; 
    }
}