// フォームとテーブル要素を取得
const form = document.getElementById('rankingForm');
const rankingTable = document.getElementById('rankingTable');

// 編集中かどうか管理する変数
let editMode = false;
// 編集ボタンのDOMを取得
const editBtn = document.querySelector('.edit');

//削除するかのポップアップのdivタグを取得
const confirmDiv = document.querySelector('.confirm');

// localStorageに保存されているランキングデータを取得
let rankingData = JSON.parse(localStorage.getItem('ranking')) || [];

// ランキングデータを表示する関数
function displayRanking() {
    rankingTable.innerHTML = ''; // テーブルをリセット

    // データをスコア順にソート
    rankingData.sort((a, b) => b.score - a.score);

    rankingData.forEach((entry, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${i + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.score}</td>
        <td>${entry.date}</td>
        <td class="delete_td hidden">
            <button onclick="confirmDelete(${i})">削除</button>
        </td>`;
        rankingTable.appendChild(row);
    });
}

//編集ボタンを押したときの処理
editBtn.addEventListener('click', () => {
    let items = document.querySelectorAll('.delete_td');
    if (editMode) {
        items.forEach(item => {
            item.classList.remove('hidden');
        });
        editMode = !editMode;
    } else {
        items.forEach(item => {
            item.classList.add('hidden');
        });
        editMode = !editMode
    }
});


// ランキングを削除するか確認する関数
async function confirmDelete(index) {
    confirmDiv.classList.remove('hidden');
    result = await waitForYesOrNo();
    if (result === 'yes') {
        deleteEntry(index);
    };  
    confirmDiv.classList.add('hidden');
}
function waitForYesOrNo() {
    return new Promise(resolve => {
        yes.addEventListener('click', () => resolve('yes'), { once: true });
        no.addEventListener('click', () => resolve('no'), { once: true });
    });
}

// ランキングを削除する関数
function deleteEntry(index) {
    rankingData.splice(index, 1); // 指定したインデックスのデータを削除
    localStorage.setItem('ranking', JSON.stringify(rankingData)); // 更新されたデータを保存
    displayRanking(); // 更新後のランキングを表示
    editBtn.click();
}

// フォームの送信イベントリスナー
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // 入力されたデータを取得
    const name = document.getElementById('name').value;
    const score = document.getElementById('score').value;
    const date = new Date().toLocaleString();

    // ランキングデータに追加
    rankingData.push({ name, date, score });

    // データをlocalStorageに保存
    localStorage.setItem('ranking', JSON.stringify(rankingData));

    // フォームをリセット
    form.reset();

    // ランキングを表示
    displayRanking();
});

// ページ読み込み時にランキングを表示
displayRanking();