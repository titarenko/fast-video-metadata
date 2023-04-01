import { parse } from "../../src/parsers/mdat";
import { File } from "../../src/file";
import { describe, test, expect } from "@jest/globals";

describe("ftyp", () => {
  test("should parse", async () => {
    const buffer = Buffer.from([]);

    const result = await parse({
      offset: 0,
      type: "mdat",
      size: buffer.length + 8,
      file: {
        async readContent() {
          return buffer;
        },
      } as File,
    });

    expect(result).toStrictEqual({
      ignored: true,
    });
  });
});
