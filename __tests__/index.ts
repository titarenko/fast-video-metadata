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
    });
  });
});
