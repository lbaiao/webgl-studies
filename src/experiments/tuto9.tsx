import React from 'react';
import { fragment_shader_2d_300es } from '../shaders/fragment_shader_2d_300es';
import { vertex_shader_2d_300es_matrix } from '../shaders/vertex_shader_2d_300es_matrix';
import { resizeCanvasToDisplaySize, createProgram, createShader } from '../utils/webglUtils';
import { setFFigure } from '../utils/drawFigures';
import TestSlider from '../components/slider';
import { mat3 } from '../matrix/mat3';
import { degToRad } from '../utils/mathUtils';


function setupWebGL(gl: WebGL2RenderingContext, pointerParams: PointerParams): WebGLStuff {
  // Get A WebGL context
  if (!gl) {
    return {
      gl: new WebGL2RenderingContext(),
      program: new WebGLProgram(),
      positionAttributeLocation: 0,
      colorLocation: new WebGLUniformLocation(),
      matrixLocation: new WebGLUniformLocation(),
      vao: new WebGLVertexArrayObject(),
    };
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = vertex_shader_2d_300es_matrix;
  var fragmentShaderSource = fragment_shader_2d_300es;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader;
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader;

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix") as WebGLUniformLocation;
  var fixXScaleLocation = gl.getUniformLocation(program, "u_fixXScale") as WebGLUniformLocation;

  // look up where fragment data should go
  var colorLocation = gl.getUniformLocation(program, "u_color") as WebGLUniformLocation;

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  // what is this object used for??? it seems to be useless
  var vao = gl.createVertexArray() as WebGLVertexArrayObject;

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

  // origin
  var fixTranslationX = gl.canvas.width / gl.canvas.height;  // multiply the translation by the inverse of the scale fix
  var moveOrigin = mat3.translationMatrix(.06, .04, fixTranslationX);

  // set uniforms
  var matrix = new mat3();
  matrix.multiply(moveOrigin);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  gl.uniform1f(fixXScaleLocation, gl.canvas.height / gl.canvas.width);
  var color = [Math.random(), Math.random(), .5, 1];
  gl.uniform4fv(colorLocation, color);

  // set rectangle vertices
  setFFigure(gl);
  gl.vertexAttribPointer(
    positionAttributeLocation, pointerParams.size,
    gl.FLOAT, pointerParams.normalize,
    pointerParams.stride, pointerParams.offset
  );

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const stuff: WebGLStuff = {
    gl: gl,
    program: program,
    positionAttributeLocation: positionAttributeLocation,
    matrixLocation: matrixLocation,
    colorLocation: colorLocation,
    vao: vao,
  }
  return stuff;
}

function draw(stuff: WebGLStuff) {
  var gl = stuff.gl;
  // resizeCanvasToDisplaySize(gl.canvas, 1);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(stuff.program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(stuff.vao);

  // Draw the geometry.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18;
  gl.drawArrays(primitiveType, offset, count);
}

type WebGLStuff = {
  gl: WebGL2RenderingContext,
  program: WebGLProgram
  positionAttributeLocation: number,
  colorLocation: WebGLUniformLocation,
  matrixLocation: WebGLUniformLocation,
  vao: WebGLVertexArrayObject,
}

type PointerParams = {
  size: number,
  normalize: boolean,
  stride: number,
  offset: number,
}

type CanvasProps = {
  translation: Array<number>,
  thetaRotation: number,
  scaling: Array<number>,
}

type CanvasState = {
  stuff: WebGLStuff,
  translation: Array<number>,
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  canvas: React.RefObject<HTMLCanvasElement>
  pointerParams: PointerParams;
  webGLStuff?: WebGLStuff;

  constructor(props: CanvasProps) {
    super(props);

    this.setState({ translation: this.props.translation });
    this.canvas = React.createRef();
    this.pointerParams = {
      size: 2,
      normalize: false,
      stride: 0,
      offset: 0,
    };
  }

  componentDidMount() {
    if (this.canvas.current === null) {
      return;
    }
    var context = this.canvas.current.getContext("webgl2") as WebGL2RenderingContext;
    this.webGLStuff = setupWebGL(context, this.pointerParams);
    if (this.webGLStuff !== undefined) {
      draw(this.webGLStuff);
    }
    // this.setState({ stuff: this.webGLStuff });
  }

  translate(gl: WebGL2RenderingContext, translationLocation: WebGLUniformLocation, coords: Array<number>) {
    // Set the translation.
    var translation = [coords[0], coords[1], 0.0, 0.0];
    gl.uniform4fv(translationLocation, translation);
  }

  rotate(gl: WebGL2RenderingContext, rotationLocation: WebGLUniformLocation, theta: number) {
    var rad = theta / 180 * Math.PI;
    gl.uniform1f(rotationLocation, rad);
  }

  scale(gl: WebGL2RenderingContext, loc: WebGLUniformLocation, values: Array<number>) {
    gl.uniform2fv(loc, values);
  }

  // positionMatrix(): mat3 {
  //   var posMatrix = new mat3();

  //   return posMatrix;
  // }

  translationMatrix(arr: Array<number>): mat3 {
    var tMatrix = new mat3();
    tMatrix[6] = arr[0];
    tMatrix[7] = arr[1];

    return tMatrix;
  }

  updateCanvas() {
    this.setState({ translation: this.props.translation });
    if (this.webGLStuff !== undefined) {
      // this.rotate(this.webGLStuff.gl, this.webGLStuff.rotationLocation, this.props.thetaRotation);
      // this.translate(this.webGLStuff.gl, this.webGLStuff.translationLocation, this.props.translation);
      // this.scale(this.webGLStuff.gl, this.webGLStuff.scaleLocation, this.props.scaling);
      // draw(this.state.stuff);

      this.matrixCalculations(this.webGLStuff.gl, this.webGLStuff.matrixLocation);

      draw(this.webGLStuff);
    }
  }

  matrixCalculations(gl: WebGL2RenderingContext, matrixLoc: WebGLUniformLocation) {
    // setup matrices
    var rad = degToRad(this.props.thetaRotation);
    var rotation = mat3.rotationMatrix(rad);
    var fixTranslationX = gl.canvas.width / gl.canvas.height;  // multiply the translation by the inverse of the scale fix
    var translation = mat3.translationMatrix(this.props.translation[0], this.props.translation[1], fixTranslationX);
    var scaling = mat3.scalingMatrix(this.props.scaling[0], this.props.scaling[1]);
    var moveOrigin = mat3.translationMatrix(.06, .04, fixTranslationX);

    // matrix multiplication
    var matrix = translation.multiply(rotation);
    matrix = matrix.multiply(scaling);
    matrix = matrix.multiply(moveOrigin);

    gl.uniformMatrix3fv(matrixLoc, false, matrix);
  }

  render(): React.ReactNode {
    return (
      <div>
        <canvas id="c" ref={this.canvas}></canvas>
      </div>
    );
  }
}


type Props = {};
type State = {
  translation: Array<number>,
  thetaRotation: number,
  scaling: Array<number>,
}

export default class Tuto9 extends React.Component<Props, State> {
  canvas: React.RefObject<Canvas>;

  constructor(props: Props) {
    super(props);

    this.state = { translation: [0, 0], thetaRotation: 0, scaling: [1, 1] };

    // this.handleSliderChange = this.handleSliderChange.bind(this);
    this.canvas = React.createRef();
  }

  handleSliderChange(val: number, coord: string) {
    if (val === null || this.canvas.current === null) {
      return;
    }
    switch (coord) {
      case 'x':
        var aux = this.state.translation;
        aux[0] = val;
        this.setState({ translation: aux })
        break;
      case 'y':
        var aux = this.state.translation;
        aux[1] = val;
        this.setState({ translation: aux })
        break;
      case 'theta':
        this.setState({ thetaRotation: val })
        break;
      case 'x_scaling':
        var aux = this.state.scaling;
        aux[0] = val
        this.setState({ scaling: aux })
        break;
      case 'y_scaling':
        var aux = this.state.scaling;
        aux[1] = val
        this.setState({ scaling: aux })
        break;
      default:
        break;
    }

    this.canvas.current.updateCanvas();
  };

  render(): JSX.Element {
    return (
      <div>
        <div className='canvas-div'>
          <Canvas translation={this.state.translation}
            thetaRotation={this.state.thetaRotation} ref={this.canvas}
            scaling={this.state.scaling}
          ></Canvas>
        </div>
        <div className='sliders-div'>
          <TestSlider min={-1} max={1} step={0.01} name="x position"
            onChange={(val: number) => this.handleSliderChange(val, 'x')}
          />
          <TestSlider min={-1} max={1} step={0.01} name="y position"
            onChange={(val: number) => this.handleSliderChange(val, 'y')}
          />
          <TestSlider min={0} max={360} step={0.01} name="theta"
            onChange={(val: number) => this.handleSliderChange(val, 'theta')}
          />
          <TestSlider min={-5} max={5} step={0.01} name="x scaling"
            onChange={(val: number) => this.handleSliderChange(val, 'x_scaling')}
          />
          <TestSlider min={-5} max={5} step={0.01} name="y scaling"
            onChange={(val: number) => this.handleSliderChange(val, 'y_scaling')}
          />
        </div>
      </div>
    );
  }
}
