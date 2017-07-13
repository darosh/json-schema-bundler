const axios = require('axios');
const yaml = require('yamljs');
const schemaBundler = require('../dist/schema-bundler');
const schema = new schemaBundler.Schema('http://localhost:8888/json-schema-bundler/test/fixtures/openapi/yaml/petstore-separate/spec/swagger.yaml',
    null, yaml.parse, axios.get);

schema.load().then(() => {
    schema.bundle();
    // schema.deref();
    console.log(JSON.stringify(schema.bundled));
}).catch(err => console.error(err));
