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

export function setRectangle(
    gl: WebGL2RenderingContext,    
    args: Array<number>,
) {
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
    if (validArgs) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }
}

export function setFFigure(gl: WebGL2RenderingContext) {
    var coords = [
        // 150 = .2
        // left column
        0, 0,
        .04, 0,
        0, -.2,
        0, -.2,
        .04, 0,
        .04, -.2,

        // top rung
        .04, 0,
        .133, 0,
        .04, -.04,
        .04, -.04,
        .133, 0,
        .133, -.04,

        // middle rung
        .04, -.08,
        .09, -.08,
        .04, -.12,
        .04, -.12,
        .09, -.08,
        .09, -.12,
    ];

    var scaled = coords.map(x => x * 2);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(scaled),
        gl.STATIC_DRAW);
  }

export function setFFigure3D(gl: WebGL2RenderingContext) {
    var coords = [
        // 150 = .2
        // left column
        0, 0, 0,
        .04, 0, 0,
        0, -.2, 0,
        0, -.2, 0,
        .04, 0, 0,
        .04, -.2, 0,

        // top rung
        .04, 0, 0,
        .133, 0, 0,
        .04, -.04, 0,
        .04, -.04, 0,
        .133, 0, 0,
        .133, -.04, 0,

        // middle rung
        .04, -.08, 0,
        .09, -.08, 0,
        .04, -.12, 0,
        .04, -.12, 0,
        .09, -.08, 0,
        .09, -.12, 0,
    ];

    var scaled = coords.map(x => x * 2);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(scaled),
        gl.STATIC_DRAW);
  }

function validateNumber(x: number) {
    return x < 1 && x > -1;
}
