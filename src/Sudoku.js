export class Sudoku {
  constructor() {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  setCell(row, col, value) {
    this.board[row][col] = value;
  }

  getCell(row, col) {
    return this.board[row][col];
  }

  // ===== 提示功能 =====
  getCandidates(row, col) {
    if (this.board[row][col] !== 0) return [];
    const used = new Set();

    // 同行
    for (let c = 0; c < 9; c++) used.add(this.board[row][c]);
    // 同列
    for (let r = 0; r < 9; r++) used.add(this.board[r][col]);
    // 同宫
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        used.add(this.board[r][c]);
      }
    }

    return [1,2,3,4,5,6,7,8,9].filter(n => !used.has(n));
  }

  getNextHint() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cand = this.getCandidates(r, c);
        if (cand.length === 1) {
          return { row: r, col: c, value: cand[0] };
        }
      }
    }
    return null;
  }

  hasConflict() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = this.board[r][c];
        if (val === 0) continue;

        this.board[r][c] = 0;
        const cand = this.getCandidates(r, c);
        this.board[r][c] = val;

        if (!cand.includes(val)) return true;
      }
    }
    return false;
  }

  clone() {
    const copy = new Sudoku();
    for (let r = 0; r < 9; r++) {
      copy.board[r] = [...this.board[r]];
    }
    return copy;
  }
}
