import { Atom } from "../atom";

export async function parse(atom: Atom) {
  /*
  aligned(8) class ItemLocationBox extends FullBox(‘iloc’, version, 0) {
    unsigned int(4) offset_size;
    unsigned int(4) length_size;
    unsigned int(4) base_offset_size;
    if ((version == 1) || (version == 2)) {
     unsigned int(4) index_size;
    } else {
      unsigned int(4) reserved;
    }
    if (version < 2) {
      unsigned int(16) item_count;
    } else if (version == 2) {
      unsigned int(32) item_count;
    }
    for (i=0; i<item_count; i++) {
      if (version < 2) {
        unsigned int(16) item_ID;
      } else if (version == 2) {
        unsigned int(32) item_ID;
      }
    if ((version == 1) || (version == 2)) {
      unsigned int(12) reserved = 0;
      unsigned int(4) construction_method;
    }
    unsigned int(16) data_reference_index;
    unsigned int(base_offset_size*8) base_offset;
    unsigned int(16) extent_count;
    for (j=0; j<extent_count; j++) {
      if (((version == 1) || (version == 2)) && (index_size > 0)) {
        unsigned int(index_size*8) extent_index;
      }
      unsigned int(offset_size*8) extent_offset;
      unsigned int(length_size*8) extent_length;
      }
    }
  }
  */

  const content = await atom.file.readContent();
  if (!content) {
    return;
  }

  let flags = content.readUint32BE();
  const version = flags >> 24;
  flags &= 0x7fffff;
  let offset = 4;

  const sizes = content.readUInt16BE(offset);
  const offsetSize = sizes >> 12;
  const lengthSize = (sizes >> 8) & 0xf;
  const baseOffsetSize = (sizes >> 4) & 0xf;
  const indexSize = sizes & 0xf;
  offset += 2;

  let itemCount = 0;
  if (version < 2) {
    itemCount = content.readUInt16BE(offset);
    offset += 2;
  } else if (version === 2) {
    itemCount = content.readUInt32BE(offset);
    offset += 4;
  }

  const items = [];
  while (itemCount-- > 0 && offset < content.length) {
    let itemId;
    if (version < 2) {
      itemId = content.readUInt16BE(offset);
      offset += 2;
    } else if (version === 2) {
      itemId = content.readUInt32BE(offset);
      offset += 4;
    }

    let constructionMethod;
    if (version == 1 || version == 2) {
      constructionMethod = content.readUint16BE(offset) & 0xf;
      offset += 2;
    }
    const dataReferenceIndex = content.readUInt16BE(offset);
    offset += 2;

    let baseOffset = readVariableSizeNumber(offset, content, baseOffsetSize);
    offset += baseOffsetSize;

    let extentCount = content.readUInt16BE(offset);
    offset += 2;

    const extents = [];
    while (extentCount-- > 0 && offset < content.length) {
      let extentIndex;
      if ((version == 1 || version == 2) && indexSize && indexSize > 0) {
        extentIndex = readVariableSizeNumber(offset, content, indexSize);
        offset += indexSize;
      }

      const extentOffset = readVariableSizeNumber(offset, content, offsetSize);
      offset += offsetSize;

      const extentLength = readVariableSizeNumber(offset, content, lengthSize);
      offset += lengthSize;

      extents.push({
        index: extentIndex,
        offset: extentOffset,
        length: extentLength,
      });
    }

    items.push({
      itemId,
      constructionMethod,
      dataReferenceIndex,
      baseOffset,
      extents,
    });
  }

  return {
    offset: atom.offset,

    size: atom.size,
    type: "iloc",

    version,
    flags,

    offsetSize,
    lengthSize,
    indexSize,

    items,
  };
}

function readVariableSizeNumber(offset: number, content: Buffer, size: number) {
  switch (size) {
    case 0:
      return;
    case 1:
      return content.readUInt8(offset);
    case 2:
      return content.readUint16BE(offset);
    case 4:
      return content.readUint32BE(offset);
    case 8:
      return content.readBigUInt64BE(offset);
    default:
      throw new Error("unexpected size");
  }
}
