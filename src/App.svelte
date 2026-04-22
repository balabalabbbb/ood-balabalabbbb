<script>
  import { Game } from './Game.js';
  let game = new Game();
  let hint = null;

  function handleHint() {
    hint = game.getHint();
  }
</script>

<main class="p-4">
  <h1>数独作业2 - 提示与探索模式</h1>

  <div class="flex gap-2 my-4">
    <button on:click={handleHint} class="px-3 py-1 bg-blue-500 text-white rounded">💡 提示</button>
    <button on:click={() => game.startExplore()} class="px-3 py-1 bg-yellow-500 text-white rounded">🔍 开始探索</button>
    <button on:click={() => game.commitExplore()} class="px-3 py-1 bg-green-500 text-white rounded">✅ 提交探索</button>
    <button on:click={() => game.abortExplore()} class="px-3 py-1 bg-red-500 text-white rounded">❌ 放弃探索</button>
    <button on:click={() => game.exploreUndo()} class="px-3 py-1 bg-gray-500 text-white rounded">↩️ 探索撤销</button>
    <button on:click={() => game.exploreRedo()} class="px-3 py-1 bg-gray-500 text-white rounded">↪️ 探索重做</button>
  </div>

  {#if game.isExploreFailed()}
    <div class="text-red-600 font-bold my-2">⚠️ 探索失败！棋盘存在冲突</div>
  {/if}

  {#if hint}
    <div class="text-green-600 my-2">提示：第{hint.row+1}行第{hint.col+1}列填 {hint.value}</div>
  {/if}

  <div class="grid grid-cols-9 gap-1 w-fit border border-black">
    {#each Array(9).fill(0), r}
      {#each Array(9).fill(0), c}
        <input
          type="number"
          min="1" max="9"
          value={game.exploreMode ? game.exploreSudoku?.getCell(r, c) : game.currentSudoku.getCell(r, c)}
          on:input={(e) => {
            const val = parseInt(e.target.value) || 0;
            if (game.exploreMode) {
              game.exploreSetCell(r, c, val);
            } else {
              game.currentSudoku.setCell(r, c, val);
              game.saveHistory();
            }
          }}
          class="w-10 h-10 text-center border border-gray-400"
        />
      {/each}
    {/each}
  </div>
</main>
