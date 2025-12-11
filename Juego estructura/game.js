// GAME.JS (REESCRITO COMPLETAMENTE PARA ARKA NOID)

class Game {
    
    // El 'player' (Sokoban) ha sido reemplazado por la barra (paddle) y la pelota (ball).
    score = 0;
    lives = 3;
    isPaused = true; 

    constructor(canvasId, mapMatrix, images, MAPS, uiManagerInstance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        // Obtenido de APP.JS
        this.rows = mapMatrix.rows;
        this.cols = mapMatrix.cols;
        this.cellSize = this.canvas.width / this.cols; // 60px

        this.mapMatrix = mapMatrix;
        this.images = images;
        
        // **********************************************
        // NUEVOS OBJETOS DE JUEGO (Arkanoid)
        // **********************************************
        this.paddle = new Paddle(this.canvas.width, this.canvas.height);
        this.ball = new Ball(0, 0, 7, this.paddle, this.cellSize);
        
        this.initControls();
        this.gameLoop(); // ¡Inicia el motor del juego!
        // GAME.JS (Dentro del constructor)
        // ...
        this.images = images;
        this.allMaps = MAPS; // Guarda la colección de mapas
        this.currentLevel = 0; // Empieza en el nivel 0 (que es el 1)
        this.levelSpeed = 7; // Velocidad base de la pelota (se incrementará)

        this.paddle = new Paddle(this.canvas.width, this.canvas.height);
        // La pelota se inicializa usando la velocidad del nivel
        this.ball = new Ball(0, 0, 7, this.paddle, this.cellSize, this.levelSpeed); 
        this.uiManager = uiManagerInstance; // Guarda la instancia
        
        // Inicializa el HUD con los valores base
        this.uiManager.updateHUD(this.score, this.lives, this.totalLives); 
        
        this.initControls();
        this.gameLoop();

        this.initControls();
        this.gameLoop();

        // GAME.JS (DENTRO DEL CONSTRUCTOR)
        this.levelTransitionStartTime = 0; // Para controlar cuándo mostrar el mensaje de nivel
        this.transitionDuration = 2000; // 2 segundos de duración de la pantalla de Nivel
// ...
    }

    // **********************************************
    // 1. CICLO PRINCIPAL DEL JUEGO (Motor de tiempo real)
    // **********************************************
    gameLoop = () => {
        if (!this.isPaused) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
    
    // **********************************************
    // 2. ACTUALIZACIÓN DE ESTADO (Física y Colisiones)
    // **********************************************
    // GAME.JS (update MODIFICADO)

    update() {
        // 1. CHEQUEAR SI LA PAUSA ES POR TRANSICIÓN DE NIVEL
        if (this.isPaused && this.levelTransitionStartTime > 0) {
            const elapsed = Date.now() - this.levelTransitionStartTime;
            if (elapsed > this.transitionDuration) {
                // La transición ha terminado, ¡reanudar el juego!
                this.isPaused = false;
                this.levelTransitionStartTime = 0; // Resetear
            } else {
                // Si sigue en transición, no actualizar la física ni la barra
                return; 
            }
        }

        // El resto de tu lógica de update va aquí:
        this.paddle.update();
        
        const ballStatus = this.ball.update(this.canvas.width, this.canvas.height);
        
        if (ballStatus === 'LOST_LIFE') {
            this.lives--;
            // ... (Lógica de Game Over)
        }

        this.paddle.handleBallCollision(this.ball);
        this.handleBrickCollision();
        
        // El chequeo de victoria lo maneja handleBrickCollision, que llama a nextLevel
    }

    // **********************************************
    // 3. LÓGICA DE COLISIÓN DE LADRILLOS (Corazón de Arkanoid)
    // **********************************************
    // GAME.JS (handleBrickCollision MODIFICADO)

    handleBrickCollision() {
        const ballX = this.ball.x;
        const ballY = this.ball.y;
        const ballR = this.ball.radius;

        // Convierte las coordenadas de píxel (x, y) a coordenadas de matriz (r, c)
        let col = Math.floor(ballX / this.cellSize);
        let row = Math.floor(ballY / this.cellSize);

        // Verifica si la celda es válida y contiene un ladrillo destructible (Valor < 6, ej. 2, 3, 4, 5)
        const brickValue = this.mapMatrix.getValue(row, col);

        if (brickValue > 0 && brickValue < 6) { 
            // 1. Detección del tipo de colisión (Horizontal o Vertical)
            
            // Lógica simple: Invertir la componente de velocidad más grande para el rebote
            const brickCenterY = row * this.cellSize + this.cellSize / 2;
            const brickCenterX = col * this.cellSize + this.cellSize / 2;
            
            // Distancia del centro de la pelota al centro del ladrillo
            const distY = Math.abs(ballY - brickCenterY);
            const distX = Math.abs(ballX - brickCenterX);

            // Invertimos la velocidad en el eje de colisión dominante.
            // Se ajusta la lógica de rebote para priorizar la dirección de la colisión real:
            if (Math.abs(distX - this.ball.radius) < Math.abs(distY - this.ball.radius)) {
                // Colisión predominantemente Vertical (arriba/abajo), invertimos Y
                this.ball.velocity.y = -this.ball.velocity.y;
            } else { 
                // Colisión predominantemente Horizontal (lados), invertimos X
                this.ball.velocity.x = -this.ball.velocity.x;
            }

            // *******************************************************
            // 2. LÓGICA DE DESTRUCCIÓN / DAÑO (¡CAMBIO CLAVE AQUÍ!)
            // *******************************************************
            if (brickValue === 5) {
                // Ladrillo Resistente (Valor 5): Recibe el primer golpe.
                // Lo cambiamos a un ladrillo normal (ej. Valor 4 = Verde) para que el segundo golpe lo destruya.
                this.mapMatrix.setValue(row, col, 4); 
                this.score += 5; // Puntuación menor por daño
                new Audio("assets/sounds/space.mp3").play(); // Sonido de impacto fuerte
                
            } else {
                // Ladrillo Normal (Valores 2, 3, 4): Se destruye completamente.
                this.mapMatrix.setValue(row, col, 0); 
                this.score += 10; // Puntuación completa por destrucción
                new Audio("assets/sounds/mov.mp3").play(); // Sonido de destrucción
            }
            
            // *******************************************************
            // 3. CHEQUEO DE VICTORIA (Condición de Game Win)
            // *******************************************************
            // Verifica si ya no quedan ladrillos destructibles en el mapa
            if (this.mapMatrix.isLevelComplete()) {
                this.nextLevel();
            }
        }
    }

    // **********************************************
    // 4. DIBUJO Y RENDERIZADO
    // **********************************************
   // GAME.JS (FUNCIÓN draw() FINAL)
    // GAME.JS (FUNCIÓN draw() FINAL)

    draw() {
        // Limpia el canvas en cada fotograma
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibuja la matriz de ladrillos
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const value = this.mapMatrix.getValue(r, c);
                const img = this.images[value];

                if (img) {
                    this.ctx.drawImage(
                        img,
                        c * this.cellSize,
                        r * this.cellSize,
                        this.cellSize, // 60px
                        this.cellSize // 60px
                    );
                }
            }
        }
        
        // Dibuja la barra y la pelota encima
        this.paddle.draw(this.ctx);
        this.ball.draw(this.ctx);

        // *******************************************************
        // LÓGICA DE TRANSICIÓN DE NIVEL (NIVEL X)
        // *******************************************************
        if (this.levelTransitionStartTime > 0) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Fondo semitransparente oscuro
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = "#FFD700"; // Color Oro/Amarillo
            this.ctx.font = "bold 70px 'Arial Black', sans-serif"; // Fuente impactante y grande
            this.ctx.textAlign = "center";
            
            const message = `NIVEL ${this.currentLevel + 1}`;
            this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);

            // Si estamos en transición de nivel, terminamos el dibujo aquí.
            // No dibujamos Score/Vidas ni el mensaje de "Presiona ESPACIO".
            return; 
        }

        // *******************************************************
        // DIBUJA SCORE Y VIDAS (Solo si NO hay transición)
        // *******************************************************
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "left"; // Restablece la alineación a la izquierda
        this.ctx.fillText(`Puntuación: ${this.score}`, 10, this.canvas.height - 10);
        
        // El dibujo de las vidas lo moveremos al HTML cuando implementes la barra visual.
        // Por ahora, lo mantenemos en el canvas:
        this.ctx.textAlign = "right"; // Para alinearlo a la derecha del canvas
        this.ctx.fillText(`Vidas: ${this.lives}`, this.canvas.width - 10, this.canvas.height - 10); 
        
        // Dibuja mensajes de estado (PAUSA/GAME OVER)
        this.ctx.textAlign = "center"; // Centra el texto para los mensajes de estado
        if (this.lives <= 0) {
            this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.isPaused && this.ball.isStuck) {
            this.ctx.fillText("Presiona ESPACIO para iniciar/lanzar", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

        
    // **********************************************
    // 5. CONTROL DE ENTRADA (Teclado y Dobot)
    // **********************************************
    initControls() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                this.paddle.setMovement('left', true);
            } else if (e.key === "ArrowRight") {
                this.paddle.setMovement('right', true);
            } else if (e.key === " ") {
                // Lanzar la pelota y despausar el juego
                this.ball.launch(7); 
                this.isPaused = false;
            }
        });
        
        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowLeft") {
                this.paddle.setMovement('left', false);
            } else if (e.key === "ArrowRight") {
                this.paddle.setMovement('right', false);
            }
        });
        
        // NOTA: Aquí se añadiría el listener para la comunicación con el Dobot.
        // Ej: 'dobot.on('move_left', () => this.paddle.setMovement('left', true));'
    }

    // GAME.JS (Implementación de nextLevel)

  // GAME.JS (Implementación de nextLevel MODIFICADO)

    nextLevel() {
        this.currentLevel++;
        
        if (this.currentLevel < this.allMaps.length) {
            // ... (Tu lógica de velocidad y carga de mapa permanece igual)
            this.levelSpeed += 2; 
            this.mapMatrix.fillFromArray(this.allMaps[this.currentLevel]);
            
            // *******************************************************
            // 1. INICIAR TRANSICIÓN DE NIVEL
            // *******************************************************
            this.levelTransitionStartTime = Date.now(); // Registra el tiempo actual
            
            // Resetear la pelota y pausar el juego
            this.ball.isStuck = true;
            this.isPaused = true;
            this.ball.launch(this.levelSpeed); 
            
        } else {
            // Condición de Victoria Final
            this.isPaused = true;
        }
    }
    // El antiguo 'handleMove' ha sido ELIMINADO ya que era para Sokoban.
    
}

