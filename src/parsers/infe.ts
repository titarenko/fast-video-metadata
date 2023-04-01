import { Atom } from "../atom";

export async function parse(atom: Atom) {
  // aligned(8) class ItemInfoEntry extends FullBox(‘infe’, version, 0) {
  // ...
  // }

  // aligned(8) class ItemInfoExtension(unsigned int(32) extension_type)
  // {
  // }

  const content = await atom.file.readContent();
  if (!content) {
    return;
  }

  const version = content.readUInt8();
  const flags = content.readUint32BE() & 0xffffff;

  let offset = 4;

  // if ((version == 0) || (version == 1)) {
  //   unsigned int(16) item_ID;
  //   unsigned int(16) item_protection_index
  //   string item_name;
  //   string content_type;
  //   string content_encoding; //optional
  // }

  let itemId, itemProtectionIndex, itemName, contentType, contentEncoding;
  if (version === 0 || version === 1) {
    itemId = content.readUint16BE(offset);
    offset += 2;

    itemProtectionIndex = content.readUInt16BE(offset);
    offset += 2;

    itemName = readString(content, offset);
    offset += itemName.length + 1;

    contentType = readString(content, offset);
    offset += contentType.length + 1;

    contentEncoding = readString(content, offset);
    offset += contentEncoding.length + 1;
  }

  // if (version == 1) {
  //   unsigned int(32) extension_type; //optional
  //   ItemInfoExtension(extension_type); //optional
  // }

  let extensionType;
  if (version === 1) {
    extensionType = content.readUint32BE(offset);
    offset += 4;
  }

  // if (version >= 2) {
  //   if (version == 2) {
  //      unsigned int(16) item_ID;
  //    } else if (version == 3) {
  //      unsigned int(32) item_ID;
  //    }
  //    unsigned int(16) item_protection_index;
  //    unsigned int(32) item_type;
  //    string item_name;
  //    if (item_type==’mime’) {
  //      string content_type;
  //      string content_encoding; //optional
  //    } else if (item_type == ‘uri ‘) {
  //      string item_uri_type;
  //    }
  //  }

  let itemType, itemUriType;
  if (version >= 2) {
    if (version === 2) {
      itemId = content.readUInt16BE(offset);
      offset += 2;
    } else if (version === 3) {
      itemId = content.readUInt32BE(offset);
      offset += 4;
    }

    itemProtectionIndex = content.readUint16BE(offset);
    offset += 2;

    itemType = content.toString("ascii", offset, offset + 4);
    offset += 4;

    itemName = readString(content, offset);
    offset += itemName.length + 1;

    if (itemType === "mime") {
      contentType = readString(content, offset);
      offset += contentType.length + 1;

      contentEncoding = readString(content, offset);
      offset += contentEncoding.length + 1;
    } else if (itemType === "url ") {
      itemUriType = readString(content, offset);
      offset += itemUriType.length + 1;
    }
  }

  return {
    version,
    flags,

    itemId,
    itemProtectionIndex,
    itemName,
    contentType,
    contentEncoding,
    extensionType,
    itemType,
    itemUriType,
  };
}

function readString(content: Buffer, offset: number) {
  let char,
    chars = [];
  do {
    char = content.readInt8(offset++);
    if (char) {
      chars.push(char);
    }
  } while (char > 0 && offset < content.length);
  return String.fromCharCode(...chars);
}
