import { class6PoliticalScience } from './class6';
import { class7PoliticalScience } from './class7';
import { class8PoliticalScience } from './class8';
import { class9PoliticalScience } from './class9';
import { class10PoliticalScience, class10Constitution } from './class10';
import { class11PoliticalTheory } from './class11';
import { class12WorldPolitics, class12IndianPolitics } from './class12';

export const politicalScienceBooks = {
  class6: class6PoliticalScience,
  class7: class7PoliticalScience,
  class8: class8PoliticalScience,
  class9: class9PoliticalScience,
  class10: {
    democratic: class10PoliticalScience,
    constitution: class10Constitution
  },
  class11: class11PoliticalTheory,
  class12: {
    world: class12WorldPolitics,
    indian: class12IndianPolitics
  }
};