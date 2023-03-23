module.exports = parse;

async function parse(atom) {
  const content = await atom.file.readContent();
  const type = content.readInt32BE();
  const locale = content.readInt32BE(4);
  const value = content.subarray(8);
  return { type, locale, value: parseValue(type, locale, value) };
}

function parseValue(type, locale, value) {
  switch (type) {
    case 1:
      return value.toString("utf-8");
    case 2:
      return value.toString("utf-16");
    case 23:
      return value.readFloatBE();
    case 24:
      return value.readDoubleBE();
    case 65:
      return value.readInt8();
    case 66:
      return value.readInt16BE();
    case 67:
      return value.readInt32BE();
    case 74:
      return value.readBigInt64BE();
    case 75:
      return value.readUint8();
    case 76:
      return value.readUint16BE();
    case 77:
      return value.readUint32BE();
    case 78:
      return value.readBigUint64BE();
    default:
      return value;
  }
}
