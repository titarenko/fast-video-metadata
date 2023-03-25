import { Atom } from "../atom";
import { parse as parseData } from "./data";

export async function parse(atom: Atom) {
  const atoms = await atom.file.readAtoms();
  if (!atoms) {
    return;
  }
  const values = [];
  for (const a of atoms) {
    const index = Buffer.from(a.type).readUInt32BE() - 1;
    const subatoms = await a.file.readAtoms();
    if (!subatoms) {
      continue;
    }
    const dataAtom = subatoms.find((x) => x.type === "data");
    if (!dataAtom) {
      continue;
    }
    const content = await parseData(dataAtom);
    values.push({ index, ...content });
  }
  return values;
}
