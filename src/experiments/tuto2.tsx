import React, { useEffect } from 'react';
import { fragment_shader_2d_300es } from '../shaders/fragment_shader_2d_300es';
import { vertex_shader_2d_300es } from '../shaders/vertex_shader_2d_300es';
import { resizeCanvasToDisplaySize } from '../utils/webglUtils';


function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  var shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  var program = gl.createProgram() as WebGLProgram;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  // Get A WebGL context
  const canvas = document.getElementById("c") as HTMLCanvasElement;
  var gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  if (!gl) {
    return;
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = vertex_shader_2d_300es;
  var fragmentShaderSource = fragment_shader_2d_300es;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader;
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader;

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // code above this line is initialization code.
  // code below this line is rendering code.
  resizeCanvasToDisplaySize(gl.canvas, 1);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  
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
  var count = 3;
  const N_TRIANGLES = 4;

  for (var i = 0; i < N_TRIANGLES; i++) {
    var positions = [];
    for (var j = 0; j < 6; j++) {
      var x = Math.random() * 2 - 1;
      positions.push(x);
    }

    //gl.uniform2fv(scaleLocation, new Float32Array([SCALE, SCALE, 1, 1]));
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);      

    // Set a random color.
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    // draw everything
    gl.drawArrays(primitiveType, offset, count);
  }
}

const Canvas = () => {
  useEffect(() => {
    main()
  }, [])
  
  return <canvas id="c"></canvas>
}

export default class Tuto2 extends React.Component {
	render (): JSX.Element {

    return <Canvas></Canvas>
	}
}
