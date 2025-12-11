class Game {
    // Propiedades
    score = 0;
    lives = 3;
    totalLives = 3; 
    currentLevel = 0;
    levelSpeed = 7; 
    isPaused = true; 
    levelTransitionStartTime = 0;
    transitionDuration = 2000; 

    // Constructor: 5 Argumentos (Sin Dobot)
    constructor(canvasId, mapMatrix, images, MAPS, uiManagerInstance, soundManagerInstance) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        
        this.rows = mapMatrix.rows;
        this.cols = mapMatrix.cols;
        this.cellSize = 60;
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;

        this.mapMatrix = mapMatrix;
        this.images = images;
        this.allMaps = MAPS;
        this.uiManager = uiManagerInstance;
        this.soundManager = soundManagerInstance; // <-- NUEVO 

        // Inicializar Objetos
        this.paddle = new Paddle(this.canvas.width, this.canvas.height, this.soundManager); 
        this.ball = new Ball(0, 0, this.levelSpeed, this.paddle, this.cellSize, this.soundManager);
        
        // Carga nivel
        this.mapMatrix.fillFromArray(this.allMaps[this.currentLevel]);
        this.soundManager.playSound('bounce');
        this.soundManager.playSound('explosion');
        this.soundManager.playSound('lose_life');
        this.soundManager.playSound('start_game');
        // HUD Inicia
        this.notifyHUD();
        
        // Controles
        this.initControls();
        this.gameLoop();
    }

    notifyHUD() {
        if (this.uiManager) {
            this.uiManager.updateHUD(this.score, this.lives, this.totalLives);
        }
    }

    gameLoop = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
    };

    // game.js - FUNCIÓN update() CORREGIDA
    // game.js - FUNCIÓN update() CORREGIDA
    update() {
        // 1. Manejo de Transición/Pausa Estricta
        if (this.isPaused && this.levelTransitionStartTime > 0) {
            const elapsed = Date.now() - this.levelTransitionStartTime;
            if (elapsed > this.transitionDuration) {
                this.isPaused = false;
                this.levelTransitionStartTime = 0; 
            } else {
                return; 
            }
        }
        
        // *** MOVIMIENTO DE PALETA (Se permite siempre, excepto durante la transición) ***
        this.paddle.update(); 
        
        // Si isPaused es true, la pelota se reposiciona y el resto de la lógica se detiene.
        if (this.isPaused) {
            // Ejecutamos this.ball.update() aquí para que la bola siga a la paleta
            this.ball.update(this.canvas.width, this.canvas.height);
            return; 
        }

        // El resto de la lógica de juego solo se ejecuta si NO está pausado.
        
        // Movimiento de Pelota
        const ballStatus = this.ball.update(this.canvas.width, this.canvas.height);
        
        if (ballStatus === 'LOST_LIFE') {
            this.lives--;
            this.notifyHUD();
            this.soundManager.playSound('lose_life'); 
            if (this.lives > 0) {
                // Reinicio Parcial (Pérdida de vida, pero quedan vidas)
                
                // 1. Reposicionar la pelota (usa el método que definiremos en ball.js)
                this.ball.resetToPaddle(); 
                
                // 2. Pausar el juego y la pelota para esperar el lanzamiento
                this.ball.isStuck = true;
                this.isPaused = true;
                
            } else {
                // Reinicio Total (Game Over)
                this.isPaused = true;
                this.uiManager.showGameOver(false, this.score, () => this.resetGame());
            }
        }

        // Colisiones
        this.paddle.handleBallCollision(this.ball);
        this.handleBrickCollision();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Ladrillos
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const value = this.mapMatrix.getValue(r, c);
                const img = this.images[value];
                if (img) this.ctx.drawImage(img, c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
            }
        }
        
        // Objetos
        this.paddle.draw(this.ctx);
        this.ball.draw(this.ctx);

        // UI en Canvas (Transición y Pausa)
        if (this.levelTransitionStartTime > 0) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "#FFD700"; 
            this.ctx.font = "bold 70px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(`NIVEL ${this.currentLevel + 1}`, this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        if (this.isPaused && this.ball.isStuck) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "24px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Presiona ESPACIO para lanzar", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    // game.js - Función Corregida de Colisión
    handleBrickCollision() {
        // En lugar de this.ball.getCenter(), calculamos la fila y columna
        // basándonos en la posición central de la pelota y el tamaño de la celda.
        const ballCenterX = this.ball.x;
        const ballCenterY = this.ball.y;
        
        // Calcular la fila (row) y columna (col) en la matriz
        const col = Math.floor(ballCenterX / this.cellSize);
        const row = Math.floor(ballCenterY / this.cellSize);

        // Verificación de límites para evitar acceder fuera de la matriz
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return; 
        }

        const value = this.mapMatrix.getValue(row, col);

        if (value > 0 && value < 6) { 
            // ... (El resto de tu lógica de colisión y puntuación es correcta)
            if (value === 5) { // Resistente
                this.mapMatrix.setValue(row, col, 4); 
                this.score += 5;
                this.soundManager.playSound('explosion'); 
            } else { // Normal
                this.mapMatrix.setValue(row, col, 0); 
                this.score += 10; 
            }
            this.notifyHUD();

            // Rebote simple
            const ballPrevX = this.ball.x - this.ball.velocity.x;
            const brickX = col * this.cellSize;
            
            if (ballPrevX < brickX || ballPrevX > brickX + this.cellSize) {
                this.ball.velocity.x *= -1;
            } else {
                this.ball.velocity.y *= -1;
            }

            if (this.mapMatrix.isLevelComplete()) {
                this.nextLevel();
            }
        }
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel < this.allMaps.length) {
            this.levelSpeed += 2; 
            this.mapMatrix.fillFromArray(this.allMaps[this.currentLevel]);
            this.levelTransitionStartTime = Date.now(); 
            this.ball.isStuck = true;
            this.isPaused = true;
            this.ball.launch(this.levelSpeed); 
        } else {
            this.isPaused = true;
            this.uiManager.showGameOver(true, this.score, () => this.resetGame());
        }
    }

    // *** CONTROLES DE TECLADO ACTIVOS ***
    initControls() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" || e.key === "a") {
                this.paddle.setMovement('left', true);
            } else if (e.key === "ArrowRight" || e.key === "d") {
                this.paddle.setMovement('right', true);
            } else if (e.key === " " && this.ball.isStuck && this.isPaused) { 
                e.preventDefault(); 
                this.isPaused = false; // <-- CRUCIAL: Despausamos el juego
                this.ball.launch(this.levelSpeed);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowLeft" || e.key === "a") {
                this.paddle.setMovement('left', false);
            } else if (e.key === "ArrowRight" || e.key === "d") {
                this.paddle.setMovement('right', false);
            }
        });
    }
    
    resetGame() { /* Se sobrescribe en app.js */ }
}