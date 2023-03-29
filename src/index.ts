import { Atom } from "./atom";
import { File } from "./file";

export { Atom };

export interface Essentials {
  creationTime: Date;
  modificationTime: Date;
  meta: { [key: string]: any };
}

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
    return getEssentials(atoms);
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

function getEssentials(atoms: Atom[]): Essentials {
  const mvhd = find(atoms, "moov", "mvhd");
  const keys =
    find(atoms, "moov", "meta", "keys") || find(atoms, "meta", "keys");
  const ilst =
    find(atoms, "moov", "meta", "ilst") || find(atoms, "meta", "ilst");
  let result;
  if (mvhd) {
    result = { ...mvhd.content };
  }
  if (keys && ilst) {
    result = result || {};
    result.meta = {};
    for (const i of ilst.content) {
      result.meta[keys.content[i.index].value] = i.value;
    }
  }
  return result;
}

function find(atoms: Atom[], ...path: string[]) {
  let atom;
  for (const p of path) {
    atom = atoms.find((x) => x.type === p);
    if (atom && atom.atoms) {
      atoms = atom.atoms;
    } else {
      break;
    }
  }
  return atom;
}
