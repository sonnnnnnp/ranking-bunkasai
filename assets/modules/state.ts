import { Rank } from './types';

interface State {
  isEditMode: boolean;
  ranking: Rank[];

  loadRanking(): void; // localStorageからランキングデータを読み込むメソッド
  saveRanking(): void; // ランキングデータをlocalStorageに保存するメソッド
}

export const state: State = {
  isEditMode: false,
  ranking: [],

  loadRanking() {
    try {
      this.ranking = JSON.parse(localStorage.getItem('ranking') ?? '[]');
    } catch (err) {
      this.ranking = [];
    }
  },

  saveRanking() {
    localStorage.setItem('ranking', JSON.stringify(this.ranking));
  },
};
