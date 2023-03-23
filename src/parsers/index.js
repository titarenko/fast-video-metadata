const parsersByAtomType = {
  data: require("./data"),
  ilst: require("./ilst"),
  keys: require("./keys"),
  mvhd: require("./mvhd"),
};

// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html
// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/Metadata/Metadata.html
module.exports = { parse };

async function parse(atom) {
  const parser = parsersByAtomType[atom.type];
  return parser ? await parser(atom) : null;
}
