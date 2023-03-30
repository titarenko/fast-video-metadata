import { File } from "./file";

export enum StructureGuess {
  Fullbox,
  EntryCount16Bit,
  EntryCount32Bit,
}

export interface Atom {
  offset: number;

  size: number;
  type: string;

  guess?: StructureGuess;

  file: File;

  unparsed?: true;
  atoms?: Atom[];
  content?: any;
}
