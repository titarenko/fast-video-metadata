module.exports = parse;

async function parse(atom) {
  const content = await atom.file.readContent();
  let count = content.readUInt32BE(4);
  let offset = 4 + 4;
  const keys = [];
  while (count--) {
    const size = content.readUint32BE(offset);
    const namespace = content.toString("ascii", offset + 4, offset + 8);
    const value = content.toString("ascii", offset + 8, offset + size);
    keys.push({ size, namespace, value });
    offset += size;
  }
  return keys;
}
