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

  fillFromArray(array2D) {
    this.data = array2D;
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

