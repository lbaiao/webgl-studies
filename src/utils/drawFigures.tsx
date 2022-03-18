export function drawRectangle(
    gl: WebGL2RenderingContext,
    positionAttributeLocation: number, colorLocation: WebGLUniformLocation,
    args: Array<number>,
): boolean {
    var x = args[0];
    var y = args[1];
    var width = args[2];
    var height = args[3];
    var positions = [
        x, y,
        x + width, y,
        x + width, y + height,
        x, y,
        x, y + height,
        x + width, y + height,
    ];

    // check if the coordinates are valid
    var validArgs = false;
    var sum = 0
    args.forEach(x => {
        sum += validateNumber(x) ? 1 : 0;
    });
    validArgs = sum == 4;
    if (!validArgs) {
        return false;
    }

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // draw
    var primitiveType = gl.TRIANGLES;
    var count = 6;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Set a random color.
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    // draw everything
    gl.drawArrays(primitiveType, offset, count);

    return true;
}

function validateNumber(x: number) {
    return x < 1 && x > -1;
}
