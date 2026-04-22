import { Sudoku } from './Sudoku.js';

export class Game {
  constructor() {
    this.currentSudoku = new Sudoku();
    this.history = [this.currentSudoku.clone()];
    this.step = 0;

    // 探索模式变量
    this.exploreMode = false;
    this.exploreSudoku = null;
    this.exploreHistory = [];
    this.exploreStep = 0;
  }

  // 保存主历史
  saveHistory() {
    this.history = this.history.slice(0, this.step + 1);
    this.history.push(this.currentSudoku.clone());
    this.step++;
  }

  // 主 Undo/Redo
  undo() {
    if (this.step > 0) {
      this.step--;
      this.currentSudoku = this.history[this.step].clone();
    }
  }

  redo() {
    if (this.step < this.history.length - 1) {
      this.step++;
      this.currentSudoku = this.history[this.step].clone();
    }
  }

  // ===== 探索模式 =====
  startExplore() {
    if (this.exploreMode) return;
    this.exploreSudoku = this.currentSudoku.clone();
    this.exploreHistory = [this.exploreSudoku.clone()];
    this.exploreStep = 0;
    this.exploreMode = true;
  }

  commitExplore() {
    if (!this.exploreMode || !this.exploreSudoku) return;
    this.currentSudoku = this.exploreSudoku.clone();
    this.saveHistory();
    this.exitExplore();
  }

  abortExplore() {
    this.exitExplore();
  }

  exitExplore() {
    this.exploreMode = false;
    this.exploreSudoku = null;
    this.exploreHistory = [];
    this.exploreStep = 0;
  }

  exploreUndo() {
    if (!this.exploreMode || this.exploreStep <= 0) return;
    this.exploreStep--;
    this.exploreSudoku = this.exploreHistory[this.exploreStep].clone();
  }

  exploreRedo() {
    if (!this.exploreMode || this.exploreStep >= this.exploreHistory.length - 1) return;
    this.exploreStep++;
    this.exploreSudoku = this.exploreHistory[this.exploreStep].clone();
  }

  exploreSetCell(row, col, value) {
    if (!this.exploreMode || !this.exploreSudoku) return false;
    this.exploreSudoku.setCell(row, col, value);
    this.exploreHistory = this.exploreHistory.slice(0, this.exploreStep + 1);
    this.exploreHistory.push(this.exploreSudoku.clone());
    this.exploreStep++;
    return true;
  }

  // ===== 提示接口 =====
  getHint() {
    const board = this.exploreMode ? this.exploreSudoku : this.currentSudoku;
    return board?.getNextHint() ?? null;
  }

  getCandidates(row, col) {
    const board = this.exploreMode ? this.exploreSudoku : this.currentSudoku;
    return board?.getCandidates(row, col) ?? [];
  }

  isExploreFailed() {
    return this.exploreSudoku?.hasConflict() ?? false;
  }
}
