import { Atom } from "../atom";

// kinda secret atom :)
// not found here https://b.goeswhere.com/ISO_IEC_14496-12_2015.pdf
// but eventually found here https://www.patentguru.com/US2022007088A1
export async function parse(atom: Atom) {
  /* aligned(8) class ItemPropertyAssociation extends FullBox(‘ipma’, version, flags) {
    unsigned int(32) entry_count;
    for(i = 0; i < entry_count; i++) {
      if (version < 1) unsigned int(16) item_ID;
      else unsigned int(32) item_ID;
      unsigned int(8) association_count;
      for (i=0; i<association_count; i++) {
        bit(1) essential;
        if (flags & 1) unsigned int(15) property_index;
        else unsigned int(7) property_index;
      }
    }
  }*/

  const content = await atom.file.readContent();
  if (!content) {
    return;
  }

  const version = content.readUInt8();
  const flags = content.readUint32BE() & 0xffffff;

  const long = flags & 1;

  let offset = 4;

  let entryCount = content.readUint32BE(offset);
  offset += 4;

  const entries = [];
  while (entryCount-- && offset < content.length) {
    const itemId =
      version < 1 ? content.readUint16BE(offset) : content.readUint32BE(offset);
    offset += version < 1 ? 2 : 4;

    let associationCount = content.readUint8(offset);
    offset += 1;

    const associations = [];
    while (associationCount-- && offset < content.length) {
      const value = long
        ? content.readUint16BE(offset)
        : content.readUint8(offset);
      offset += long ? 2 : 1;

      associations.push({
        essential: value >> (long ? 15 : 7),
        propertyIndex: value & (long ? 0x7fff : 0x7f),
      });
    }

    entries.push({
      itemId,
      associations,
    });
  }

  return {
    version,
    flags,

    entries,
  };
}
