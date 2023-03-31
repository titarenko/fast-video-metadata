import { Atom } from "../atom";

import { parse as parseData } from "./data";
import { parse as parseFtyp } from "./ftyp";
import { parse as parseIloc } from "./iloc";
import { parse as parseIlst } from "./ilst";
import { parse as parseInfe } from "./infe";
import { parse as parseIpma } from "./ipma";
import { parse as parseKeys } from "./keys";
import { parse as parseMdat } from "./mdat";
import { parse as parseMvhd } from "./mvhd";

// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html
// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/Metadata/Metadata.html
// https://b.goeswhere.com/ISO_IEC_14496-12_2015.pdf
// https://www.patentguru.com/US2022007088A1
export async function parse(atom: Atom): Promise<any> {
  switch (atom.type) {
    case "data":
      return parseData(atom);
    case "ftyp":
      return parseFtyp(atom);
    case "iloc":
      return parseIloc(atom);
    case "ilst":
      return parseIlst(atom);
    case "infe":
      return parseInfe(atom);
    case "ipma":
      return parseIpma(atom);
    case "keys":
      return parseKeys(atom);
    case "mdat":
      return parseMdat(atom);
    case "mvhd":
      return parseMvhd(atom);
  }
}
