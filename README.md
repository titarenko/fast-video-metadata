# fast-video-metadata

## Example

```
const videoMetadata = require('fast-video-metadata');
const metadata = await videoMetadata.read('~/Desktop/IMG_0835.MOV')
console.log(metadata)
```

```
{
  'com.apple.quicktime.make': 'Apple',
  'com.apple.quicktime.model': 'iPhone 13 Pro',
  'com.apple.quicktime.software': '15.5',
  'com.apple.quicktime.creationdate': '2022-06-07T08:36:36+0100'
}
```
