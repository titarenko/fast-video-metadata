module.exports = parse;

async function parse(atom) {
  const content = await atom.file.readContent();

  const creationTime = content.readUInt32BE(4);
  const modificationTime = content.readUInt32BE(8);

  return {
    creationTime: parseDate(creationTime),
    modificationTime: parseDate(modificationTime),
  };
}

function parseDate(value) {
  return new Date((value - 2082844800) * 1000);
}
