const File = require("./file");

module.exports = { read };

async function read(filename, extended = false) {
  const file = new File();
  try {
    await file.open(filename);
    const atoms = await file.readAtomTree();
    if (extended) {
      omitFile(atoms);
      return atoms;
    }
    return compact(atoms);
  } finally {
    await file.close();
  }
}

function omitFile(atoms) {
  for (const a of atoms) {
    delete a.file;
    if (a.atoms) {
      omitFile(a.atoms);
    }
  }
}

function compact(atoms) {
  const mvhd = find(atoms, "moov", "mvhd");
  const keys = find(atoms, "moov", "meta", "keys");
  const ilst = find(atoms, "moov", "meta", "ilst");
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

function find(atoms, ...path) {
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
