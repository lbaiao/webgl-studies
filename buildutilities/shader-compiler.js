const fs = require('fs');
const path = require('path');

function ShaderCompiler() { /* */ }

ShaderCompiler.prototype.compile = function processShader(file) {
    if (!(file.endsWith('.c') || file.endsWith('.glsl'))) {
        return;
    }
    
    let content = fs.readFileSync(file, 'utf8');
    
    // convert .c or .glsl into .ts strings for intellisense
    content = content
        .replace(/\/\/.*/g, '')
        .replace(/"/g, '\\"')
        .replace(/\r\n/g, '\\r\\n')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, ' ')
        .replace(/ +/g, ' ');

    let name = '';
    if (file.endsWith('.c')) {
        name = path.basename(file, '.c');
    } else {
        name = path.basename(file, '.glsl');
    }
   
    content = `export const ${name} = "${content}"`;
    let result = path.join(path.dirname(file), name + '.ts');
    fs.writeFileSync(result, content);
}

ShaderCompiler.prototype.getShadersSync = function (dir) {
    let work = [dir];
    let result = [];
    while (work.length > 0) {
        let item = work.pop();
        if (fs.statSync(item).isDirectory()) {
            let files = fs.readdirSync(item);
            files.forEach(f => {
                // skip hidden directories and Node.js modules
                if (f.startsWith('.') || f === 'node_modules') {
                    return;
                }
                let fullPath = path.join(item, f);
                work.push(fullPath);
            });
        } else if (item.endsWith('.c') || item.endsWith('.glsl')) {
            result.push(item);
        }
    }
    return result;
}

module.exports = ShaderCompiler;
