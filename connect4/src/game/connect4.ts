// Connect 4 game logic module


export type Player = 1 | 2 | 0;
export type Board = Player[][];

export class Connect4 {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw';
  moves: number;
  rows: number;
  cols: number;

  constructor(rows = 6, cols = 7) {
    this.rows = rows;
    this.cols = cols;
    this.board = Array.from({ length: rows }, () => Array(cols).fill(0));
    this.currentPlayer = 1;
    this.winner = 0;
    this.moves = 0;
  }

  clone(): Connect4 {
    const clone = new Connect4(this.rows, this.cols);
    clone.board = this.board.map(row => [...row]);
    clone.currentPlayer = this.currentPlayer;
    clone.winner = this.winner;
    clone.moves = this.moves;
    return clone;
  }

  getValidMoves(): number[] {
    return this.board[0].map((cell, col) => (cell === 0 ? col : -1)).filter(col => col !== -1);
  }

  makeMove(col: number): boolean {
    if (this.winner || col < 0 || col >= this.cols || this.board[0][col] !== 0) return false;
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.board[row][col] === 0) {
        this.board[row][col] = this.currentPlayer;
        this.moves++;
        if (this.checkWin(row, col)) {
          this.winner = this.currentPlayer;
        } else if (this.moves === this.rows * this.cols) {
          this.winner = 'draw';
        } else {
          this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        }
        return true;
      }
    }
    return false;
  }

  checkWin(row: number, col: number): boolean {
    const player = this.board[row][col];
    if (!player) return false;
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let d = 1; d < 4; d++) {
        const r = row + dr * d, c = col + dc * d;
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols || this.board[r][c] !== player) break;
        count++;
      }
      for (let d = 1; d < 4; d++) {
        const r = row - dr * d, c = col - dc * d;
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols || this.board[r][c] !== player) break;
        count++;
      }
      if (count >= 4) return true;
    }
    return false;
  }

  reset() {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    this.currentPlayer = 1;
    this.winner = 0;
    this.moves = 0;
  }
}
