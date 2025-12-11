// APP.JS (MODIFICADO)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// **********************************************
// MODIFICACIÓN DE DIMENSIONES PARA 12x16
// **********************************************
canvas.width = 960; 
canvas.height = 720;

const rows = 12; // Nuevo número de filas
const cols = 16; // Nuevo número de columnas
const cellSize = canvas.width / cols; // -> 60px

// Crear instancia de Matrix con las nuevas dimensiones
const mapMatrix = new Matrix(rows, cols);
mapMatrix.fillFromArray(MAPS[0]); // MAP_DATA debe ajustarse a 12x16

const images = {};
let loadedCount = 0;
const totalImages = 12; // Asegúrese de que este número sea exacto

// Cargar imágenes...

for (let i = 0; i < totalImages; i++) {
  const img = new Image();
  img.src = `assets/${i}.png`;
  img.onload = () => {
    loadedCount++;
    if (loadedCount === totalImages) {
      const game = new Game("gameCanvas", mapMatrix, images, MAPS);
    }
    
  };
  images[i] = img;
  
}

// APP.JS (MODIFICADO)

// ... (Definición de canvas, rows, cols, mapMatrix)

// CREAR LA INSTANCIA DE UI MANAGER (definida en ui_manager.js)
// Ya que definiste "ui_manager.js" en tu HTML, la instancia 'uiManager' estará disponible globalmente
// si usaste 'const uiManager = new UIManager();' al final de ui_manager.js

let game; // Declarar 'game' fuera del onload para poder reiniciarlo

function startGame() {
    // Asegurarse de que el juego no se cree dos veces
    if (game) {
        // Si el juego existe, simplemente despausarlo o manejar el reseteo
        game.isPaused = false;
        uiManager.hideGameOver();
        return;
    }
    
    // El 'uiManager' debe estar disponible globalmente si usaste la estructura del paso 1.
    // Pasamos la instancia de uiManager
    game = new Game("gameCanvas", mapMatrix, images, MAPS, uiManager); 

    // Aquí en APP.JS necesitamos una función para que Game.js pueda llamar al reiniciar
    game.resetGame = () => {
        // Resetea las variables del juego
        game.score = 0;
        game.lives = game.totalLives;
        game.currentLevel = 0;
        game.levelSpeed = 7;
        
        // Carga el primer mapa y resetea la pelota
        game.mapMatrix.fillFromArray(game.allMaps[0]);
        game.ball = new Ball(0, 0, 7, game.paddle, game.cellSize, game.levelSpeed);
        game.ball.isStuck = true;
        game.isPaused = true;
        
        uiManager.updateHUD(game.score, game.lives, game.totalLives);
        uiManager.initStartScreen(startGame); // Para volver a lanzar con ESPACIO
    };
}


// ... (Lógica de carga de imágenes)

if (loadedCount === totalImages) {
    // 1. Configura el UI Manager para escuchar el clic de inicio
    uiManager.initStartScreen(startGame); 
    
    // 2. Opcional: Si quieres iniciar el juego inmediatamente después de la carga:
    // startGame(); 
}
// ...