import { parse } from "../../src/parsers/ipma";
import { File } from "../../src/file";
import { describe, test, expect } from "@jest/globals";

describe("ipma", () => {
  test("should parse", async () => {
    const buffer = Buffer.from([
      /*0x00, 0x00, 0x01, 0x3f, 0x69, 0x70, 0x6d, 0x61,*/
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x32, 0x00, 0x01, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x02, 0x03, 0x83, 0x81, 0x82, 0x00, 0x03, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x04, 0x03, 0x83, 0x81, 0x82, 0x00, 0x05, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x06, 0x03, 0x83, 0x81, 0x82, 0x00, 0x07, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x08, 0x03, 0x83, 0x81, 0x82, 0x00, 0x09, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x0a, 0x03, 0x83, 0x81, 0x82, 0x00, 0x0b, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x0c, 0x03, 0x83, 0x81, 0x82, 0x00, 0x0d, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x0e, 0x03, 0x83, 0x81, 0x82, 0x00, 0x0f, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x10, 0x03, 0x83, 0x81, 0x82, 0x00, 0x11, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x12, 0x03, 0x83, 0x81, 0x82, 0x00, 0x13, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x14, 0x03, 0x83, 0x81, 0x82, 0x00, 0x15, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x16, 0x03, 0x83, 0x81, 0x82, 0x00, 0x17, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x18, 0x03, 0x83, 0x81, 0x82, 0x00, 0x19, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x1a, 0x03, 0x83, 0x81, 0x82, 0x00, 0x1b, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x1c, 0x03, 0x83, 0x81, 0x82, 0x00, 0x1d, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x1e, 0x03, 0x83, 0x81, 0x82, 0x00, 0x1f, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x20, 0x03, 0x83, 0x81, 0x82, 0x00, 0x21, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x22, 0x03, 0x83, 0x81, 0x82, 0x00, 0x23, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x24, 0x03, 0x83, 0x81, 0x82, 0x00, 0x25, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x26, 0x03, 0x83, 0x81, 0x82, 0x00, 0x27, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x28, 0x03, 0x83, 0x81, 0x82, 0x00, 0x29, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x2a, 0x03, 0x83, 0x81, 0x82, 0x00, 0x2b, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x2c, 0x03, 0x83, 0x81, 0x82, 0x00, 0x2d, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x2e, 0x03, 0x83, 0x81, 0x82, 0x00, 0x2f, 0x03, 0x83,
      0x81, 0x82, 0x00, 0x30, 0x03, 0x83, 0x81, 0x82, 0x00, 0x31, 0x04, 0x81,
      0x04, 0x85, 0x06, 0x00, 0x32, 0x05, 0x81, 0x87, 0x08, 0x85, 0x06,
    ]);

    const result = await parse({
      offset: 0,
      type: "ipma",
      size: buffer.length + 8,
      file: {
        async readContent() {
          return buffer;
        },
      } as File,
    });

    expect(result).toStrictEqual({
      offset: 0,
      size: 319,
      type: "ipma",
      version: 0,
      flags: 0,
      entries: [
        {
          itemId: 1,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 2,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 3,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 4,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 5,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 6,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 7,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 8,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 9,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 10,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 11,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 12,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 13,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 14,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 15,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 16,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 17,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 18,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 19,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 20,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 21,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 22,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 23,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 24,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 25,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 26,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 27,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 28,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 29,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 30,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 31,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 32,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 33,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 34,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 35,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 36,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 37,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 38,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 39,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 40,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 41,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 42,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 43,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 44,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 45,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 46,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 47,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 48,
          associations: [
            { essential: 1, propertyIndex: 3 },
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 2 },
          ],
        },
        {
          itemId: 49,
          associations: [
            { essential: 1, propertyIndex: 1 },
            { essential: 0, propertyIndex: 4 },
            { essential: 1, propertyIndex: 5 },
            { essential: 0, propertyIndex: 6 },
          ],
        },
        {
          itemId: 50,
          associations: [
            { essential: 1, propertyIndex: 1 },
            { essential: 1, propertyIndex: 7 },
            { essential: 0, propertyIndex: 8 },
            { essential: 1, propertyIndex: 5 },
            { essential: 0, propertyIndex: 6 },
          ],
        },
      ],
    });
  });
});
