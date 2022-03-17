const fs = require('fs');
const path = require('path');
const ShaderCompiler = require('./shader-compiler');

let dir = process.argv[2];

if (dir) {
    console.log('Manual comp ' + dir);
    //let files = comp(dir);

    var sc = new ShaderCompiler();
    var files = sc.getShadersSync(dir);
    files.forEach(file => {
        console.log('C File: ', file);
        sc.compile(file);
    });
}

//module.exports = comp;
