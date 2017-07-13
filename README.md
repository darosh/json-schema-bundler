# JSON Schema Bundler

Lightweight JSON Schema reference parser. See [demo online](https://darosh.github.io/json-schema-bundler/test/).


## Features

- Bundles external [JSON Schema](http://json-schema.org/) references into internal references
- Dereferences internal references
- Works with JSON and YAML format
- Bundles external text file formats as well
- Follows [specification](http://json-schema.org/latest/json-schema-core.html#rfc.section.8): *All other properties in a "$ref" object MUST be ignored.*
- By default requires [axios](https://github.com/mzabriskie/axios) and [yamljs](https://github.com/jeremyfa/yaml.js) but can be replaced by alternatives via injection
- [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- Runs in browser and server
- HTTP and file system on server
- Loading progress report
- Internal file cache available (for offline [PWA](https://developers.google.com/web/progressive-web-apps/)s)
- Small **8 KB** footprint


## Usage


### Browser

TODO


### Node

TODO


## Alternatives

TODO

- [BigstickCarpet/json-schema-ref-parser](https://github.com/BigstickCarpet/json-schema-ref-parser)
