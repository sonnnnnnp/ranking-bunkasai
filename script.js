// フォームとテーブル要素を取得
const form = document.querySelector('#rankingForm');
const rankingTable = document.querySelector('#rankingTable');

//APIからデータを取得
let rankingData = fetch('/api/rankings')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

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
        <td>${entry.date}</td>`;
        rankingTable.appendChild(row);
    });
}

// ページ読み込み時にランキングを表示
displayRanking();