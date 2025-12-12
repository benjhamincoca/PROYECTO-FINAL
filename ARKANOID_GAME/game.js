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
        this.allMaps = MAPS;
        this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[this.currentLevel])));
      
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
            this.soundManager.playSound('lose_life') 
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
            // 1. Manejo del ladrillo tipo 5 (Resistente)
            if (value === 5) { 
                this.mapMatrix.setValue(row, col, 4); 
                this.score += 5;
                this.soundManager.playSound('explosion'); // <-- Usamos EXPLOSION para el resistente
            } else { 
                // 2. Manejo de otros ladrillos (Normales)
                this.mapMatrix.setValue(row, col, 0); 
                this.score += 10; 
                
                // 💡 AÑADIR/ASEGURAR ESTA LLAMADA PARA LADRILLOS NORMALES 💡
                this.soundManager.playSound('bounce'); // <-- Usamos BOUNCE para el normal
            }
            this.notifyHUD();

            // 3. Lógica de rebote (se mantiene)
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
            this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[this.currentLevel])));
        } else {
            this.isPaused = true;
            this.uiManager.showGameOver(true, this.score, () => this.resetGame());
        }
        this.gameWin();
    }

    // *** CONTROLES DE TECLADO ACTIVOS ***
    // game.js - Método initControls() CORREGIDO Y COMPLETO

// game.js - Método initControls() CORREGIDO Y COMPLETO

// game.js - Método initControls() CORREGIDO Y COMPLETO

    initControls() {
        document.addEventListener("keydown", (e) => {
            // --- 1. Movimiento de Paleta (keydown) ---
            if (e.key === "ArrowLeft" || e.key === "a") {
                this.paddle.setMovement('left', true);
            } else if (e.key === "ArrowRight" || e.key === "d") {
                this.paddle.setMovement('right', true);
            } 
            
            // --- 2. LANZAMIENTO / INICIO (Espacio o Enter) ---
            // Condición: La pelota está pegada, quedan vidas, y se presiona Lanzar.
            // Se omite la verificación de 'this.isPaused' en la condición, ya que la forzamos a false dentro.
            if ((e.key === " " || e.key === "Enter") && this.ball.isStuck && this.lives > 0) { 
                e.preventDefault(); 
                
                // 💡 Acción: Despausar y Lanzar 💡
                this.isPaused = false; 
                this.ball.launch(this.levelSpeed); 
                
                if (this.soundManager) {
                    this.soundManager.playSound('start_game');
                }
                // Si tienes un botón de inicio en pantalla, añade aquí el método para ocultarlo
                // Ejemplo: this.uiManager.hideStartButton(); 
            }
            
            // --- 3. REINICIO (Enter solo si Game Over) ---
            // Condición: No quedan vidas (Game Over) Y se presiona Enter.
            if (e.key === "Enter" && this.lives <= 0) {
                e.preventDefault(); 
                this.resetGame(); // Llama a la función de reinicio completo
                // Si tienes un botón de Reinicio/Game Over en pantalla, ocúltalo aquí
                // Ejemplo: this.uiManager.hideGameOver(); 
            }

        });

        document.addEventListener("keyup", (e) => {
            // --- 4. Detener Movimiento de Paleta (keyup) ---
            if (e.key === "ArrowLeft" || e.key === "a") {
                this.paddle.setMovement('left', false);
            } else if (e.key === "ArrowRight" || e.key === "d") {
                this.paddle.setMovement('right', false);
            }
        });
    }
   // game.js - Función resetGame()

   resetGame() {
    // 1. Reiniciar Variables de Estado
    this.score = 0;
    this.lives = this.totalLives; 
    this.currentLevel = 0;
    this.levelSpeed = 3; 
    this.isPaused = true; 
    this.levelTransitionStartTime = 0;

    // 💡 CRÍTICO: REINICIAR EL MAPA usando la COPIA PROFUNDA 💡
    // Esto asegura que el mapMatrix se llene con los valores originales (1, 2, 3...)
    this.mapMatrix.fillFromArray(JSON.parse(JSON.stringify(this.allMaps[0])));
        // 2. Reiniciar Objetos de Juego
        this.paddle.reset(); // Asegura que la paleta esté centrada
        this.ball.resetToPaddle(); // Reposiciona la pelota
        this.ball.isStuck = true; 
        
        // 3. Actualizar la Interfaz
        this.uiManager.hideGameOver();
        this.notifyHUD();
    }

    // game.js - NUEVA FUNCIÓN gameWin()

    gameWin() {
        // 1. Detener el juego
        this.isPaused = true;
        
        // 2. Mostrar mensaje de victoria (Usando el UIManager)
        // Asumo que tu UIManager tiene un método para mostrar la pantalla de victoria
        this.uiManager.showGameWin(this.score); 

        //sonido de victoria
        if (this.soundManager) {
            this.soundManager.playSound('win_sound'); 
        }

        // NOTA: No llamamos a resetGame() aquí. El jugador debe ver la pantalla de victoria,
        // y si la pantalla de victoria tiene un botón "Jugar de Nuevo", este botón
        // debe ser el que llame a this.resetGame() al hacer click.
    }
}