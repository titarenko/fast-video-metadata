import { Atom } from "../atom";

export async function parse(atom: Atom) {
  const content = await atom.file.readContent();
  if (!content) {
    return;
  }
  const majorBrand = content.toString("ascii", 0, 4);
  const minorBrand = content.toString("ascii", 4, 8);
  const compatibleBrands = [];
  let offset = 8;
  while (offset < atom.size - 8) {
    compatibleBrands.push(content.toString("ascii", offset, offset + 4));
    offset += 4;
  }
  return {
    majorBrand,
    minorBrand,
    compatibleBrands,
  };
}
