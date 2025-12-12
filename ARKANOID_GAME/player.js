class Player {
  constructor(row, col, value = 1) {
    this.row = row;
    this.col = col;
    this.value = value;
  }

  move(dr, dc, rows, cols) {
    const newRow = this.row + dr;
    const newCol = this.col + dc;

    // Evitar salirse del mapa
    if (newRow < 0 || newRow >= rows) return;
    if (newCol < 0 || newCol >= cols) return;

    this.row = newRow;
    this.col = newCol;
  }
}
