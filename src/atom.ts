import { File } from "./file";

export interface Atom {
  type: string;
  file: File;
  unparsed?: true;
  atoms?: Atom[];
  content?: any;
}
