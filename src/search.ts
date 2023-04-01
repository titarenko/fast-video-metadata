import { Atom } from "./atom";

export function findAtomByTypeChain(atoms: Atom[], ...typeChain: string[]) {
  let atom,
    t = typeChain.shift();
  while (t) {
    atom = atoms.find((x) => x.type === t);
    if (atom && atom.atoms) {
      atoms = atom.atoms;
    } else if (typeChain.length) {
      return;
    }
    t = typeChain.shift();
  }
  return atom;
}

export function findAtomByType(atoms: Atom[], type: string): Atom | undefined {
  for (const a of atoms) {
    if (a.type === type) {
      return a;
    }
  }
  for (const a of atoms) {
    if (a.atoms) {
      return findAtomByType(a.atoms, type);
    }
  }
}
