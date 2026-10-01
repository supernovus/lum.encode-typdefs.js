# lum.encode-typdefs.js

Some predefined [TypDef] sets using [@lumjs/encode] APIs.

This package was extracted out of one of my apps. While it's fairly specialised
and likely not super useful for most people, it's used by some other code I'm
planning to extract from the app into another package so it can be used by more
of my own apps down the road.

## Exports

There are two primary modules available:
- `@lumjs/encode-typdefs` : Default module.
- `@lumjs/encode-typdefs/dom` : Adds DOM support.

They both export the same named properties:

- `EncDef()` : A version of `TypDef()` that applies specific options.
- `sets` : An object with the actual typdefs in it.
  - `BaseEncodings`
  - `HashEncodings`
  - `HashAlgos`
  - `KeyFormats`
  - `EncryptAlgos`
  - `SignAlgos`
  - `IntArrays`
  - `FloatArrays`

The `sets` is also the _default export_ from both modules.
See the `lib/data.js` file for details on what the typdefs contain.

## Example Usage

```js
import ET from '@lumjs/encode-typdefs';

// Raw string data to be encoded
let rawdata = 'hello world';

// Encoding example
let encoder = ET.BaseEncodings.Base91;
let myDoc = {
  encType: encoder.val,              // A number (in this case, `0`)
  encData: encoder.encode(rawdata),
}

// Decoding example
let decoder = ET.BaseEncodings[myDoc.encType];  // decoder === encoder
let decoded = decoder.decode(myDoc.encData);    // decoded === rawdata
```

See the files in the `test` folder for more examples.

## Known Issues

So right now if you run `node ./test/dom-elems.js` it works perfectly.
If you do `npm test`, which uses a harness to run `test/*`, that test
file claims to have failed. Very similar tests in the [TypDef] package
work just fine running them either way. I will try to track down whatever
is causing it another day, for now it can be safely ignored.

## Official URLs

This library can be found in two places:

 * [Github](https://github.com/supernovus/lum.encode-typdefs.js)
 * [NPM](https://www.npmjs.com/package/@lumjs/encode-typdefs)

## Author

Timothy Totten <2010@totten.ca>

## License

[MIT](https://spdx.org/licenses/MIT.html)

---
[TypDef]: https://github.com/supernovus/lum.typdef.js
[@lumjs/encode]: https://github.com/supernovus/lum.encode.js
