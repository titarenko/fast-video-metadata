import { Atom } from "./atom";
import { File } from "./file";
import { Essentials, getEssentials } from "./essentials";

export { Atom, Essentials };

export async function read(filename: string, extended = false) {
  const file = new File();
  try {
    await file.open(filename);
    const atoms = await file.readAtomTree();
    if (!atoms) {
      return;
    }
    if (extended) {
      deleteFileProperty(atoms);
      return atoms;
    }
    return await getEssentials(atoms);
  } finally {
    await file.close();
  }
}

function deleteFileProperty(atoms: Partial<Atom>[]) {
  for (const a of atoms) {
    delete a.file;
    if (a.atoms) {
      deleteFileProperty(a.atoms);
    }
  }
}
