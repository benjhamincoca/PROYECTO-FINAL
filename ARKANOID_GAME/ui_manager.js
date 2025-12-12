// ui_manager.js

class UIManager {
    constructor() {
        this.playerNameDisplay = document.getElementById('hud-player-name');
        this.scoreDisplay = document.getElementById('hud-score');
        this.healthDisplay = document.getElementById('hud-health');
        this.hudContainer = document.getElementById('game-hud');
        
        this.startModal = document.getElementById('start-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.playerNameInput = document.getElementById('player-name-input');
        this.startGameBtn = document.getElementById('start-game-btn');
        this.gameStatusText = document.getElementById('game-status-text');
        this.gameStatusDate = document.getElementById('game-status-date');
        this.restartGameBtn = document.getElementById('restart-game-btn');

        this.playerName = 'Jugador'; // Valor por defecto
    }

    /** Muestra el modal de inicio y registra el evento de inicio */
    initStartScreen(callback) {
        this.startGameBtn.addEventListener('click', () => {
            let name = this.playerNameInput.value.trim();
            this.playerName = name || 'Jugador Arcano';
            
            this.playerNameDisplay.textContent = this.playerName;
            this.startModal.classList.add('hidden');
            this.hudContainer.classList.remove('hidden');
            
            // Inicia el juego (función que Game.js debe proveer)
            callback();
        });
    }

    /** Actualiza la información del HUD dinámicamente */
    updateHUD(score, lives, totalLives) {
        this.scoreDisplay.textContent = `Puntuación: ${score}`;
        
        // Crea una representación visual de las vidas (ej. corazones o iconos)
        let livesHtml = '';
        for (let i = 0; i < totalLives; i++) {
            if (i < lives) {
                // Vida restante (ej. corazón lleno, usa un símbolo simple)
                livesHtml += '<span class="life-icon">❤️</span>';
            } else {
                // Vida perdida (ej. corazón vacío/gris)
                livesHtml += '<span class="life-icon lost">🖤</span>';
            }
        }
        this.healthDisplay.innerHTML = `Salud: ${livesHtml}`;
    }

    /** Muestra el modal de Game Over o Game Win */
    showGameOver(isWin, score, callback) {
        const date = new Date().toLocaleString();
        
        this.gameStatusText.textContent = isWin ? 
            `¡VICTORIA! Puntuación Final: ${score}` : 
            `GAME OVER. Puntuación: ${score}`;
            
        this.gameStatusDate.textContent = `Fecha: ${date}`;
        
        this.gameOverModal.classList.remove('hidden');
        
        this.restartGameBtn.onclick = () => {
            this.gameOverModal.classList.add('hidden');
            callback(); // Función para reiniciar el juego
        };
    }
    
    hideGameOver() {
        this.gameOverModal.classList.add('hidden');
    }
}

const uiManager = new UIManager();