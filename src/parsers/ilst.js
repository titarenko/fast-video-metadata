const parseData = require("./data");

module.exports = parse;

async function parse(atom) {
  const atoms = await atom.file.readAtoms();
  const values = [];
  for (const a of atoms) {
    const index = Buffer.from(a.type).readUInt32BE() - 1;
    const subatoms = await a.file.readAtoms();
    const content = await parseData(subatoms.find((x) => x.type === "data"));
    values.push({ index, ...content });
  }
  return values;
}
