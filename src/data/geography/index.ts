import { class6Geography } from './class6';
import { class7Geography } from './class7';
import { class8Geography } from './class8';
import { class9Geography } from './class9';
import { class10Geography } from './class10';
import { class11GeographyPhysical, class11GeographyIndia, class11GeographyPractical } from './class11';
import { class12GeographyHuman, class12GeographyIndia } from './class12';

export const geographyBooks = {
  class6: class6Geography,
  class7: class7Geography,
  class8: class8Geography,
  class9: class9Geography,
  class10: class10Geography,
  class11: {
    physical: class11GeographyPhysical,
    india: class11GeographyIndia,
    practical: class11GeographyPractical
  },
  class12: {
    human: class12GeographyHuman,
    india: class12GeographyIndia
  }
};