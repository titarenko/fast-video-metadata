import { describe, expect, test } from "@jest/globals";
import { read } from "../src";

describe("fast-video-metadata", () => {
  test("should work", async () => {
    const info = await read(
      `${__dirname}/assets/telegram-cloud-document-2-5258484539604348281.mp4`
    );
    expect(info).toStrictEqual({
      creationTime: new Date("2023-03-25T15:34:24.000Z"),
      modificationTime: new Date("2023-03-25T15:34:24.000Z"),
      meta: {},
    });
  });

  test("heic", async () => {
    const info = await read(
      `/Volumes/F16/maybe__2022-01-31__16-53-49__Apple-iPhone-XS__IMG_9066.HEIC`
    );
    expect(info).toStrictEqual({
      creationTime: new Date("2022-05-10T15:48:20.000Z"),
      modificationTime: new Date("2022-05-10T15:48:20.000Z"),
      meta: {
        "exif.image.make": "Apple",
        "exif.image.model": "iPhone XS",
      },
    });
  });
});
