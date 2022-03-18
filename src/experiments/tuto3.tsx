import React, { useEffect } from 'react';
import { fragment_shader_2d_300es } from '../shaders/fragment_shader_2d_300es';
import { vertex_shader_2d_300es } from '../shaders/vertex_shader_2d_300es';
import { resizeCanvasToDisplaySize, createProgram, createShader } from '../utils/webglUtils';
import { drawRectangle } from '../utils/drawFigures';


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
  var colorLocation = gl.getUniformLocation(program, "u_color") as WebGLUniformLocation;

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

  // draw
  const N_RECTS = 32;
  for (var i = 0; i < N_RECTS; i++) {
    var validArgs = false;
    var args: Array<number> = [];

    while (!validArgs) {
      args = [];
      for (var j = 0; j < 4; j++) {
        args.push(Math.random() * 2 - 1);
      }
      validArgs = drawRectangle(gl, positionAttributeLocation, colorLocation, args);
    }
  }
}

const Canvas = () => {
  useEffect(() => {
    main()
  }, [])

  return <canvas id="c"></canvas>
}

export default class Tuto3 extends React.Component {
  render(): JSX.Element {

    return <Canvas></Canvas>
  }
}
