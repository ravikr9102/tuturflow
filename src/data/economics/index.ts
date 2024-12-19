import { class9Economics } from './class9';
import { class10Economics } from './class10';
import { class11Economics } from './class11';
import { class12EconomicsMacro, class12EconomicsMicro } from './class12';

export const economicsBooks = {
  class9: class9Economics,
  class10: class10Economics,
  class11: class11Economics,
  class12: {
    macro: class12EconomicsMacro,
    micro: class12EconomicsMicro
  }
};