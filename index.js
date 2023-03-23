const fs = require("fs/promises");

module.exports = { read: getVideoInfo };

async function getVideoInfo(filename) {
  let file;
  try {
    file = await fs.open(filename, "r");
    // https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html
    const meta = await readAtomBranch(file, "moov", "meta");
    if (!meta) {
      return;
    }
    // https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/Metadata/Metadata.html
    const keys = meta.find((x) => x.type === "keys");
    const keysContent = await readKeysAtomContent(file, keys);
    const ilst = meta.find((x) => x.type === "ilst");
    const ilstContent = await readIlstAtomContent(file, ilst);
    return ilstContent.reduce(
      (memo, x) => ({
        ...memo,
        [keysContent[x.type - 1]]: x.value,
      }),
      {}
    );
  } finally {
    if (file) {
      await file.close();
    }
  }
}

async function readAtoms(file, offset, limit) {
  const atoms = [];
  const buffer = Buffer.alloc(8);
  while (offset < limit) {
    await file.read(buffer, 0, buffer.length, offset);
    const size = buffer.readInt32BE();
    const type = buffer.toString("ascii", 4);
    atoms.push({ offset, size, type });
    if (size === 0) {
      break;
    }
    offset += size;
  }
  return atoms;
}

async function readSubatoms(file, atom) {
  return readAtoms(file, atom.offset + 8, atom.offset + atom.size);
}

async function readAtomBranch(file, ...path) {
  const stat = await file.stat();
  let atoms = await readAtoms(file, 0, stat.size);
  for (const s of path) {
    const a = atoms.find((x) => x.type === s);
    if (!a) {
      return;
    }
    atoms = await readSubatoms(file, a);
  }
  return atoms;
}

async function readKeysAtomContent(file, atom) {
  const buffer = Buffer.alloc(atom.size);
  await file.read(
    buffer,
    0,
    buffer.length,
    atom.offset + 8,
    atom.offset + atom.size
  );
  let entryCount = buffer.readInt32BE(4);
  const keys = [];
  let offset = 8;
  while (entryCount--) {
    const size = buffer.readInt32BE(offset);
    // 4 is for size, another 4 is for namespace
    const key = buffer.toString("ascii", offset + 4 + 4, offset + size);
    keys.push(key);
    offset += size;
  }
  return keys;
}

async function readIlstAtomContent(file, atom) {
  const children = await readSubatoms(file, atom);
  const result = [];
  for (const c of children) {
    const ca = await readSubatoms(file, c);
    const cad = ca.find((x) => x.type === "data");
    const buffer = Buffer.alloc(cad.size);
    await file.read(buffer, 0, buffer.length - 8, cad.offset + 8);
    result.push({
      type: Buffer.from(c.type).readInt32BE(),
      value: buffer.toString("ascii", 8, buffer.length - 8),
    });
  }
  return result;
}
