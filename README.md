# fast-video-metadata

Fast video metadata extraction without dependencies (e. g. spawning ffmpeg or exiftool).

## Examples

### Essentials (opinionated)

```js
const videoMetadata = require("fast-video-metadata");
const metadata = await videoMetadata.read("~/Desktop/IMG_0835.MOV");
console.log(metadata);
```

```
{
  creationTime: 2017-08-05T15:20:28.000Z,
  modificationTime: 2017-08-05T15:21:23.000Z,
  meta: {
    'com.apple.quicktime.make': 'Apple',
    'com.apple.quicktime.model': 'iPhone 6',
    'com.apple.quicktime.software': '10.1.1',
    'com.apple.quicktime.creationdate': '2017-08-05T18:20:28+0300'
  }
}
```

### Full atom tree

```js
const videoMetadata = require("fast-video-metadata");
const metadata = await videoMetadata.read("~/Desktop/IMG_0835.MOV", true);
console.log(metadata);
```

```
[
  { type: 'ftyp', unparsed: true },
  { type: 'wide', unparsed: true },
  { type: 'mdat', atoms: [ { type: '\x00r\x1BD', unparsed: true } ] },
  {
    type: 'moov',
    atoms: [
      {
        type: 'mvhd',
        content: {
          creationTime: 2017-08-05T15:20:28.000Z,
          modificationTime: 2017-08-05T15:21:23.000Z
        }
      },
      {
        type: 'trak',
        atoms: [
          {
            type: 'tkhd',
            atoms: [ { type: 'U+\x12<', unparsed: true } ]
          },
          {
            type: 'tapt',
            atoms: [
              { type: 'clef', unparsed: true },
              { type: 'prof', unparsed: true },
              { type: 'enof', unparsed: true }
            ]
          },
          { type: 'edts', atoms: [ { type: 'elst', unparsed: true } ] },
          {
            type: 'mdia',
            atoms: [
              { type: 'mdhd', unparsed: true },
              { type: 'hdlr', unparsed: true },
              {
                type: 'minf',
                atoms: [
                  { type: 'vmhd', unparsed: true },
                  { type: 'hdlr', unparsed: true },
                  {
                    type: 'dinf',
                    atoms: [ { type: 'dref', unparsed: true } ]
                  },
                  {
                    type: 'stbl',
                    atoms: [
                      { type: 'stsd', unparsed: true },
                      { type: 'stts', unparsed: true },
                      { type: 'stss', unparsed: true },
                      { type: 'sdtp', unparsed: true },
                      { type: 'stsc', unparsed: true },
                      { type: 'stsz', unparsed: true },
                      { type: 'stco', unparsed: true }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'trak',
        atoms: [
          {
            type: 'tkhd',
            atoms: [ { type: 'U+\x12<', unparsed: true } ]
          },
          { type: 'edts', atoms: [ { type: 'elst', unparsed: true } ] },
          {
            type: 'mdia',
            atoms: [
              { type: 'mdhd', unparsed: true },
              { type: 'hdlr', unparsed: true },
              {
                type: 'minf',
                atoms: [
                  { type: 'smhd', unparsed: true },
                  { type: 'hdlr', unparsed: true },
                  {
                    type: 'dinf',
                    atoms: [ { type: 'dref', unparsed: true } ]
                  },
                  {
                    type: 'stbl',
                    atoms: [
                      { type: 'stsd', unparsed: true },
                      { type: 'stts', unparsed: true },
                      { type: 'stsc', unparsed: true },
                      { type: 'stsz', unparsed: true },
                      { type: 'stco', unparsed: true }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'trak',
        atoms: [
          {
            type: 'tkhd',
            atoms: [ { type: 'U+\x12<', unparsed: true } ]
          },
          { type: 'edts', atoms: [ { type: 'elst', unparsed: true } ] },
          {
            type: 'tref',
            atoms: [
              { type: 'cdsc', unparsed: true },
              { type: 'cdep', unparsed: true }
            ]
          },
          {
            type: 'mdia',
            atoms: [
              { type: 'mdhd', unparsed: true },
              { type: 'hdlr', unparsed: true },
              {
                type: 'minf',
                atoms: [
                  {
                    type: 'gmhd',
                    atoms: [ { type: 'gmin', unparsed: true } ]
                  },
                  { type: 'hdlr', unparsed: true },
                  {
                    type: 'dinf',
                    atoms: [ { type: 'dref', unparsed: true } ]
                  },
                  {
                    type: 'stbl',
                    atoms: [
                      { type: 'stsd', unparsed: true },
                      { type: 'stts', unparsed: true },
                      { type: 'stsc', unparsed: true },
                      { type: 'stsz', unparsed: true },
                      { type: 'stco', unparsed: true }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'trak',
        atoms: [
          {
            type: 'tkhd',
            atoms: [ { type: 'U+\x12<', unparsed: true } ]
          },
          { type: 'edts', atoms: [ { type: 'elst', unparsed: true } ] },
          {
            type: 'tref',
            atoms: [
              { type: 'cdsc', unparsed: true },
              { type: 'cdep', unparsed: true }
            ]
          },
          {
            type: 'mdia',
            atoms: [
              { type: 'mdhd', unparsed: true },
              { type: 'hdlr', unparsed: true },
              {
                type: 'minf',
                atoms: [
                  {
                    type: 'gmhd',
                    atoms: [ { type: 'gmin', unparsed: true } ]
                  },
                  { type: 'hdlr', unparsed: true },
                  {
                    type: 'dinf',
                    atoms: [ { type: 'dref', unparsed: true } ]
                  },
                  {
                    type: 'stbl',
                    atoms: [
                      { type: 'stsd', unparsed: true },
                      { type: 'stts', unparsed: true },
                      { type: 'stsc', unparsed: true },
                      { type: 'stsz', unparsed: true },
                      { type: 'stco', unparsed: true }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'meta',
        atoms: [
          { type: 'hdlr', unparsed: true },
          {
            type: 'keys',
            content: [
              {
                size: 32,
                namespace: 'mdta',
                value: 'com.apple.quicktime.make'
              },
              {
                size: 33,
                namespace: 'mdta',
                value: 'com.apple.quicktime.model'
              },
              {
                size: 36,
                namespace: 'mdta',
                value: 'com.apple.quicktime.software'
              },
              {
                size: 40,
                namespace: 'mdta',
                value: 'com.apple.quicktime.creationdate'
              }
            ]
          },
          {
            type: 'ilst',
            content: [
              { index: 0, type: 1, locale: 0, value: 'Apple' },
              { index: 1, type: 1, locale: 0, value: 'iPhone 6' },
              { index: 2, type: 1, locale: 0, value: '10.1.1' },
              {
                index: 3,
                type: 1,
                locale: 0,
                value: '2017-08-05T18:20:28+0300'
              }
            ]
          }
        ]
      }
    ]
  }
]
```

## Unparsed

See those `unparsed: true` and want that data?
No problem, you are welcome to contribute!
Look into `./src/parsers` and add missing one (named after atom type).
