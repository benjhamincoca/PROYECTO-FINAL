class Matrix {
  rows;
  cols;
  data;

  constructor(rowsParam, colsParam, defaultValue = 1) {
    this.rows = rowsParam;
    this.cols = colsParam;
    this.data = [];

    for (let i = 0; i < rowsParam; i++) {
      const rowTemp = [];
      for (let j = 0; j < colsParam; j++) {
        rowTemp.push(defaultValue);
      }
      this.data.push(rowTemp);
    }
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  setValue(row, col, value) {
    if (this.isValidPosition(row, col)) {
      this.data[row][col] = value;
    }
  }

  getValue(row, col) {
    return this.isValidPosition(row, col) ? this.data[row][col] : null;
  }

  // Clase Matrix - Método fillFromArray CORREGIDO

  fillFromArray(array2D) {
      // Verificar si la nueva matriz tiene las dimensiones esperadas (opcional pero recomendado)
      if (array2D.length !== this.rows || array2D[0].length !== this.cols) {
          console.error("Error: La matriz de entrada no coincide con las dimensiones de la matriz.");
          // Opcionalmente, podrías redimensionar o lanzar un error. Por simplicidad, continuamos.
      }
      
      // 💡 SOLUCIÓN CRÍTICA: Crear una nueva matriz (deep copy) para this.data
      this.data = []; // Aseguramos que data sea una matriz nueva
      
      for (let i = 0; i < this.rows; i++) {
          const rowTemp = [];
          for (let j = 0; j < this.cols; j++) {
              // Copiamos el valor de la matriz de entrada (array2D) a la nueva matriz (rowTemp)
              rowTemp.push(array2D[i][j]);
          }
          this.data.push(rowTemp);
      }
  }

  isLevelComplete() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const value = this.data[i][j];
        if (value > 0 && value < 6) { 
          return false; // Quedan ladrillos destructibles
        }
      }
    }
    return true; // Todos los ladrillos destructibles han sido eliminados
  }


  toString() {
    return this.data.map(row => row.join('\t')).join('\n');
  }
}

