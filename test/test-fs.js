const fs = require('fs');
const yaml = require('yamljs');
const schemaBundler = require('../dist/schema-bundler');

function getFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {

            if (err) {
                reject(err);
            } else {
                resolve({
                    headers: {},
                    data: data
                })
            }
        });
    });
}

const schema = new schemaBundler.Schema('./test/fixtures/openapi/yaml/petstore-separate/spec/swagger.yaml',
    null, yaml.parse, getFile);

schema.load().then(() => {
    schema.bundle();
    // schema.deref();
    console.log(JSON.stringify(schema.bundled));
}).catch(err => console.error(err));
