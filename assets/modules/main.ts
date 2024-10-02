import { state } from './state';

document.addEventListener('DOMContentLoaded', () => {
  state.loadRanking();

  // フォームとテーブル要素を取得
  const form = document.getElementById('rankingForm')! as HTMLFormElement;
  const rankingTable = document.getElementById('rankingTable')!;

  // 編集ボタンのDOMを取得
  const editBtn = document.querySelector('.edit')! as HTMLButtonElement;

  //削除するかのポップアップのdivタグを取得
  const confirmDiv = document.querySelector('.confirm')!;

  // ランキングデータを表示する関数
  function displayRanking() {
    rankingTable.innerHTML = ''; // テーブルをリセット

    // データをスコア順にソート
    state.ranking.sort((a, b) => b.score - a.score);

    state.ranking.forEach((entry, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td>${entry.date}</td>
        <td class="delete_td hidden"></td>`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '削除';
      deleteButton.addEventListener('click', () => confirmDelete(i));

      row.querySelector('.delete_td')!.appendChild(deleteButton);
      rankingTable.appendChild(row);
    });
  }

  //編集ボタンを押したときの処理
  editBtn.addEventListener('click', () => {
    let items = document.querySelectorAll('.delete_td');
    if (state.isEditMode) {
      items.forEach((item) => {
        item.classList.remove('hidden');
      });
      state.isEditMode = !state.isEditMode;
    } else {
      items.forEach((item) => {
        item.classList.add('hidden');
      });
      state.isEditMode = !state.isEditMode;
    }
  });

  // ランキングを削除するか確認する関数
  async function confirmDelete(index: number) {
    confirmDiv.classList.remove('hidden');
    if ((await waitForYesOrNo()) === 'yes') {
      deleteEntry(index);
    }
    confirmDiv.classList.add('hidden');
  }
  function waitForYesOrNo() {
    return new Promise((resolve) => {
      const yesButton = document.getElementById('yes') as HTMLButtonElement;
      const noButton = document.getElementById('no') as HTMLButtonElement;

      yesButton.addEventListener('click', () => resolve('yes'), { once: true });
      noButton.addEventListener('click', () => resolve('no'), { once: true });
    });
  }

  // ランキングを削除する関数
  function deleteEntry(index: number) {
    state.ranking.splice(index, 1); // 指定したインデックスのデータを削除
    state.saveRanking();
    displayRanking(); // 更新後のランキングを表示
    editBtn.click();
  }

  // フォームの送信イベントリスナー
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // 入力されたデータを取得
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const scoreInput = document.getElementById('score') as HTMLInputElement;

    // ランキングデータに追加
    state.ranking.push({
      name: nameInput.value,
      score: parseInt(scoreInput.value),
      date: new Date().toLocaleString(),
    });

    // データをlocalStorageに保存
    state.saveRanking();

    // フォームをリセット
    form.reset();

    // ランキングを表示
    displayRanking();
  });

  // ページ読み込み時にランキングを表示
  displayRanking();
});
