import { parse } from "../../src/parsers/infe";
import { File } from "../../src/file";
import { describe, test, expect } from "@jest/globals";

describe("infe", () => {
  test("should parse", async () => {
    const buffer = Buffer.from([
      /*0x00, 0x00, 0x00, 0x15, 0x69, 0x6e, 0x66, 0x65,*/ 0x02, 0x00, 0x00,
      0x01, 0x00, 0x02, 0x00, 0x00, 0x68, 0x76, 0x63, 0x31, 0x00,
    ]);
    const result = await parse({
      offset: 0,
      type: "infe",
      size: buffer.length + 8,
      file: {
        async readContent() {
          return buffer;
        },
      } as File,
    });

    expect(result).toStrictEqual({
      offset: 0,
      size: 21,
      type: "infe",

      version: 2,
      flags: 1,

      itemId: 2,
      itemName: "",
      itemProtectionIndex: 0,

      contentEncoding: undefined,
      contentType: undefined,
      extensionType: undefined,

      itemType: "hvc1",
      itemUriType: undefined,
    });
  });
});
