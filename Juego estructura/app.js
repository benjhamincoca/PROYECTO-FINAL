// app.js - VERSIÓN FINAL UNIFICADA Y CORREGIDA

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Parámetros de la matriz
const rows = 12;
const cols = 16;
const cellSize = 60; 

// Crear instancia de Matrix
const mapMatrix = new Matrix(rows, cols, 1);
const images = {};

// Variables de control de carga
const totalImages = 12; 
let loadedCount = 0;
let game; // Variable para la instancia del juego

// ********************************************************************
// FUNCIÓN PRINCIPAL: INICIA O REINICIA EL JUEGO (Llamada por el UI Manager)
// ********************************************************************
function startGame() {
    // 1. Si la instancia no existe, la creamos con todas sus dependencias
    if (!game) {
        // La instancia Game contiene el constructor, el gameLoop, y la inicialización de controles.
        game = new Game(
            "gameCanvas", 
            mapMatrix, 
            images, 
            MAPS, 
            uiManager,
            soundManager 
        ); 
        
        // 2. Sobrescribimos el método resetGame en la instancia Game
        // Esta función será llamada por game.js cuando el jugador pierda la vida.
        game.resetGame = () => {
            // Resetear estado del juego
            game.score = 0;
            game.lives = 3; 
            game.currentLevel = 0;
            game.levelSpeed = 7;
            
            // Re-inicializar Paddle y Ball para un nuevo comienzo (¡CRUCIAL!)
            game.paddle = new Paddle(game.canvas.width, game.canvas.height);
            game.ball = new Ball(0, 0, game.ball.radius, game.paddle, game.cellSize);
            
            // Cargar mapa
            game.mapMatrix.fillFromArray(game.allMaps[0]);
            
            // Devolver al estado de pausa inicial
            game.ball.isStuck = true;
            game.isPaused = true;
            game.levelTransitionStartTime = 0; 
            
            // Actualizar HUD y volver a la pantalla de inicio (para lanzar con ESPACIO)
            uiManager.updateHUD(game.score, game.lives, 3);
            // NOTA: No llamamos a uiManager.initStartScreen aquí, el game.js lo hace
            // al detectar que la pelota está pegada y el juego está pausado (ver draw en game.js).
        };
        
        // 3. Establecemos el estado inicial del juego
        game.resetGame();

    } else {
        // Si ya existe y el usuario hace clic en Iniciar/Reiniciar:
        // Si es después de un Game Over, llama a resetGame().
        if (game.lives <= 0) {
            game.resetGame();
        }
        
        // Simplemente despausa y oculta el modal
        game.isPaused = false;
        uiManager.hideGameOver();
    }
}

// ********************************************************************
// CARGA DE IMÁGENES
// ********************************************************************
for (let i = 0; i < totalImages; i++) {
    const img = new Image();
    img.src = `assets/${i}.png`; // Asegúrate de que las imágenes existan
    
    img.onload = () => {
        loadedCount++;
        checkAllImagesLoaded();
    };
    
    img.onerror = () => {
        console.error(`Error cargando imagen: assets/${i}.png`);
        loadedCount++;
        checkAllImagesLoaded();
    };

    images[i] = img;
}

function checkAllImagesLoaded() {
    if (loadedCount === totalImages) {
        console.log("Imágenes cargadas. Inicializando el UI.");
        // Después de cargar, inicializamos el UI para que llame a startGame() con el botón.
        if (typeof uiManager !== 'undefined') {
            uiManager.initStartScreen(startGame);
        } else {
            console.error("Error: uiManager no está definido.");
        }
    }
}