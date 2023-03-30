import { parse } from "../../src/parsers/ftyp";
import { File } from "../../src/file";
import { describe, test, expect } from "@jest/globals";

describe("ftyp", () => {
  test("should parse", async () => {
    const buffer = Buffer.from([
      /*0x00, 0x00, 0x00, 0x24, 0x66, 0x74, 0x79, 0x70,*/ 0x68, 0x65, 0x69,
      0x63, 0x00, 0x00, 0x00, 0x00, 0x6d, 0x69, 0x66, 0x31, 0x4d, 0x69, 0x50,
      0x72, 0x6d, 0x69, 0x61, 0x66, 0x4d, 0x69, 0x48, 0x42, 0x68, 0x65, 0x69,
      0x63,
    ]);
    const result = await parse({
      offset: 0,
      type: "ftyp",
      size: buffer.length + 8,
      file: {
        async readContent() {
          return buffer;
        },
      } as File,
    });

    expect(result).toStrictEqual({
      offset: 0,
      size: 36,
      type: "ftyp",
      majorBrand: "heic",
      minorBrand: "\0\0\0\0",
      compatibleBrands: ["mif1", "MiPr", "miaf", "MiHB", "heic"],
    });
  });
});
