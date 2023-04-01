import exifReader from "exif-reader";
import { Atom } from "./atom";
import { findAtomByTypeChain } from "./search";

export interface Essentials {
  creationTime: Date;
  modificationTime: Date;
  meta: { [key: string]: any };
}

export async function getEssentials(
  atoms: Atom[]
): Promise<Essentials | undefined> {
  const mov = await getMovEssentials(atoms);
  if (mov) {
    return mov;
  }

  const heic = await getHeicEssentials(atoms);
  return heic;
}

async function getMovEssentials(
  atoms: Atom[]
): Promise<Essentials | undefined> {
  const mvhd = findAtomByTypeChain(atoms, "moov", "mvhd");
  const keys = findAtomByTypeChain(atoms, "moov", "meta", "keys");
  const ilst = findAtomByTypeChain(atoms, "moov", "meta", "ilst");
  let result;
  if (mvhd) {
    result = { ...mvhd.content };
  }
  if (keys && ilst) {
    result = result || {};
    result.meta = {};
    for (const i of ilst.content) {
      result.meta[keys.content[i.index].value] = i.value;
    }
  } else if (result) {
    result.meta = {};
  }
  return result;
}

export async function getHeicEssentials(
  atoms: Atom[]
): Promise<Essentials | undefined> {
  const iinf = findAtomByTypeChain(atoms, "meta", "iinf");
  if (!iinf) {
    return;
  }
  const exifItem = iinf.atoms?.find((a) => a?.content?.itemType === "Exif");
  if (!exifItem) {
    return;
  }
  const iloc = findAtomByTypeChain(atoms, "meta", "iloc");
  if (!iloc) {
    return;
  }
  const exifLocation = iloc.content?.items?.find(
    (i: any) => i.itemId === exifItem.content?.itemId
  );
  if (!exifLocation) {
    return;
  }
  if (exifLocation.extents?.length !== 1) {
    throw new Error("unupported number of extents");
  }
  const exifExtent = exifLocation.extents[0];
  const exifData = await exifItem.file.readContent(
    exifExtent.offset + 4,
    exifExtent.length - 4
  );
  if (!exifData) {
    return;
  }
  const exif = exifReader(exifData);

  const timezoneOffset = exif?.exif
    ? exif.exif["36880"] || exif.exif["36881"] || exif.exif["36882"]
    : undefined;
  const creationTime = getExifDateWithTimezone(
    exif?.exif?.DateTimeOriginal,
    timezoneOffset
  );
  const modificationTime = getExifDateWithTimezone(
    exif?.image?.ModifyDate,
    timezoneOffset
  );
  if (!creationTime) {
    return;
  }

  const meta = {} as Record<string, any>;

  const make = exif?.image?.Make;
  if (make) {
    meta["exif.image.make"] = make;
  }

  const model = exif?.image?.Model;
  if (model) {
    meta["exif.image.model"] = model;
  }

  return {
    creationTime,
    modificationTime: modificationTime || creationTime,
    meta,
  };
}

function getExifDateWithTimezone(
  date: unknown,
  timezoneOffset: unknown
): Date | undefined {
  const known = date instanceof Date && typeof timezoneOffset === "string";
  if (!known) {
    return;
  }
  const s = date.toISOString();
  return new Date(s.replace("Z", timezoneOffset));
}
