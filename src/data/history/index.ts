import { class12HistoryPart1, class12HistoryPart2, class12HistoryPart3 } from './class12';
import { class11History } from './class11';
import { class10History } from './class10';
import { class9History } from './class9';
import { class8History } from './class8';

export const historyBooks = {
  class8: class8History,
  class9: class9History,
  class10: class10History,
  class11: class11History,
  class12: {
    part1: class12HistoryPart1,
    part2: class12HistoryPart2,
    part3: class12HistoryPart3
  }
};