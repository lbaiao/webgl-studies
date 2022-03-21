import React from 'react';
import { fragment_shader_2d_300es } from '../shaders/fragment_shader_2d_300es';
import { vertex_shader_2d_300es_scaling } from '../shaders/vertex_shader_2d_300es_scaling';
import { resizeCanvasToDisplaySize, createProgram, createShader } from '../utils/webglUtils';
import { setFFigure } from '../utils/drawFigures';
import TestSlider from '../components/slider';


function setupWebGL(gl: WebGL2RenderingContext, pointerParams: PointerParams): WebGLStuff {
  // Get A WebGL context
  if (!gl) {
    return {
      gl: new WebGL2RenderingContext(),
      program: new WebGLProgram(),
      positionAttributeLocation: 0,
      colorLocation: new WebGLUniformLocation,
      translationLocation: new WebGLUniformLocation,
      rotationLocation: new WebGLUniformLocation,
      scaleLocation: new WebGLUniformLocation,
      vertexArray: new WebGLVertexArrayObject,
    };
  }

  // Get the strings for our GLSL shaders
  var vertexShaderSource = vertex_shader_2d_300es_scaling;
  var fragmentShaderSource = fragment_shader_2d_300es;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource) as WebGLShader;
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader;

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader) as WebGLProgram;

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getUniformLocation(program, "u_color") as WebGLUniformLocation;
  var translationLocation = gl.getUniformLocation(program, "u_translation") as WebGLUniformLocation;
  var rotationLocation = gl.getUniformLocation(program, "u_rotation") as WebGLUniformLocation;
  var fixXScaleLocation = gl.getUniformLocation(program, "u_fixXScale") as WebGLUniformLocation;
  var scaleLocation = gl.getUniformLocation(program, "u_scale") as WebGLUniformLocation;

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

  // set uniforms
  gl.uniform4fv(translationLocation, [0, 0, 0, 0]);
  gl.uniform1f(rotationLocation, 0);
  gl.uniform1f(fixXScaleLocation, gl.canvas.height / gl.canvas.width);
  gl.uniform2fv(scaleLocation, [1, 1]);
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
    colorLocation: colorLocation,
    translationLocation: translationLocation,
    rotationLocation: rotationLocation,
    scaleLocation: scaleLocation,
    vertexArray: vao
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
  // this vertexArray seems to be useless. I am leaving it
  // here just to be sure.
  gl.bindVertexArray(stuff.vertexArray);

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
  translationLocation: WebGLUniformLocation,
  rotationLocation: WebGLUniformLocation,
  scaleLocation: WebGLUniformLocation,
  vertexArray: WebGLVertexArrayObject,
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
  xPosition: number,
  yPosition: number,
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  canvas: React.RefObject<HTMLCanvasElement>
  pointerParams: PointerParams;
  webGLStuff?: WebGLStuff;

  constructor(props: CanvasProps) {
    super(props);

    this.setState({ xPosition: props.translation[0], yPosition: props.translation[1] });
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

  updateCanvas() {
    this.setState({ xPosition: this.props.translation[1], yPosition: this.props.translation[1] });
    if (this.webGLStuff !== undefined) {
      this.rotate(this.webGLStuff.gl, this.webGLStuff.rotationLocation, this.props.thetaRotation);
      this.translate(this.webGLStuff.gl, this.webGLStuff.translationLocation, this.props.translation);
      this.scale(this.webGLStuff.gl, this.webGLStuff.scaleLocation, this.props.scaling);
      // draw(this.state.stuff);
      draw(this.webGLStuff);
    }
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

export default class Tuto8 extends React.Component<Props, State> {
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
