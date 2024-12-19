import { Book } from "../../../types/education";
import { chapter1 } from "./chapter1";
import { chapter2 } from "./chapter2";

export const class6Geography: Book = {
  id: "class6_geography",
  title: "The Earth Our Habitat",
  class: "6th",
  subject: "Geography",
  chapters: [chapter1, chapter2],
};
