import { Atom } from "../atom";

import { parse as parseData } from "./data";
import { parse as parseIlst } from "./ilst";
import { parse as parseKeys } from "./keys";
import { parse as parseMvhd } from "./mvhd";

const parsersByAtomType = {
  data: require("./data"),
  ilst: require("./ilst"),
  keys: require("./keys"),
  mvhd: require("./mvhd"),
};

// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html
// https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/Metadata/Metadata.html
export async function parse(atom: Atom): Promise<any> {
  switch (atom.type) {
    case "data":
      return parseData(atom);
    case "ilst":
      return parseIlst(atom);
    case "keys":
      return parseKeys(atom);
    case "mvhd":
      return parseMvhd(atom);
  }
}
