
// 6 = ESQUINA_SUP_IZQ
// 7 = ESQUINA_SUP_DER
// 8 = ESQUINA_INF_DER
// 9 = ESQUINA_INF_IZQ
// 10 = LADO_MURO_HOR
// 11 = LADO_MURO_VER
// 2 BLOQUE aMARILLO
// 3 BLOQUE FUCSIA
// 4 BLOQUE VERDE

/// main.js (Estructura Multi-Nivel)

// **********************************************
// CONVENCIONES DE LA MATRIZ (ACTUALIZADAS)
// Las dimensiones son 12 Filas x 16 Columnas (60px x 60px)
// **********************************************
// 0 = VACÍO (Fondo)
// 2 = BLOQUE AMARILLO (1 golpe)
// 3 = BLOQUE FUCSIA (1 golpe)
// 4 = BLOQUE VERDE (1 golpe)
// 5 = BLOQUE DE RESISTENCIA (Requiere 2 golpes) <-- CLAVE PARA DIFICULTAD PROGRESIVA
// Muros Indestructibles: 6-11

const MAPS = []; // Arreglo principal que contendrá todos los niveles.

// **********************************************
// MAPA 1: Nivel Básico (Enfoque en patrones simples)
// **********************************************
MAPS[0] = [
    // 0  1   2   3   4   5   6   7   8   9  10  11  12  13  14  15 <- Columna
    [6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7], // Fila 0 (Muro superior)
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], // Fila 1 (Vacía)
    [11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11], // Fila 2 (Ladrillos normales)
    [11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 11], // Fila 3
    [11, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 11], // Fila 4 (Patrón con huecos)
    [11, 3, 3, 3, 0, 0, 3, 3, 3, 3, 0, 0, 3, 3, 3, 11], // Fila 5 (Patrón con huecos)
    [11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11], // Fila 6
    [11, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 11], // Fila 7
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], // Fila 8
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], // Fila 9
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], // Fila 10
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8]  // Fila 11 (Muro inferior)
];

// **********************************************
// MAPA 2: Nivel Intermedio (Uso intensivo del Ladrillo Resistente '5')
// **********************************************
MAPS[1] = [
    [6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7], 
    [11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11], // Dificultad: Filas completas de Resistencia
    [11, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 11], 
    [11, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 11], // Dificultad: Patrón mixto normal/resistente
    [11, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 11], 
    [11, 2, 3, 5, 2, 3, 5, 2, 3, 5, 2, 3, 5, 2, 3, 11],
    [11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11], // Dificultad: Más Resistencia
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], 
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], 
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], 
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], 
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8]
];

// **********************************************
// MAPA 3: Nivel Difícil (Obstáculos internos y Precisión)
// **********************************************
MAPS[2] = [
    [6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 7], 
    [11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11], // Resistencia en el techo
    [11, 2, 0, 0, 3, 11, 0, 0, 4, 0, 0, 11, 3, 0, 0, 11], // Dificultad: Muros internos (11) crean pasillos
    [11, 3, 0, 4, 0, 11, 4, 0, 3, 0, 4, 11, 0, 4, 0, 11], 
    [11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11], // Resistencia
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], 
    [11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11], 
    [11, 4, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 3, 11], 
    [11, 3, 0, 4, 0, 11, 4, 0, 3, 0, 4, 11, 0, 4, 0, 11], 
    [11, 2, 0, 0, 3, 11, 0, 0, 4, 0, 0, 11, 3, 0, 0, 11], 
    [11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11], 
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8]
];

// NOTA: Se elimina la antigua declaración 'const MAP_DATA = MAPS[0];' 
// para evitar el error de sintaxis y usar la colección MAPS completa.



/*

const MAP_DATA = [];
for (let i = 0; i < 25; i++) {
  const row = [];
  for (let j = 0; j < 25; j++) {
    row.push(Math.floor(Math.random() * 198)); // 0 a 197
  }
  MAP_DATA.push(row);
}
*/