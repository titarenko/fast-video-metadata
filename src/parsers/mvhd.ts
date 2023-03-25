import { Atom } from "../atom";

export async function parse(atom: Atom) {
  const content = await atom.file.readContent();
  if (!content) {
    return;
  }

  const creationTime = content.readUInt32BE(4);
  const modificationTime = content.readUInt32BE(8);

  return {
    creationTime: parseDate(creationTime),
    modificationTime: parseDate(modificationTime),
  };
}

function parseDate(value: number) {
  return new Date((value - 2082844800) * 1000);
}
