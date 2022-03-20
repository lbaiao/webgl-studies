import React, { useEffect } from 'react';
import { fragment_shader_2d_300es } from '../shaders/fragment_shader_2d_300es';
import { vertex_shader_2d_300es } from '../shaders/vertex_shader_2d_300es';
import { resizeCanvasToDisplaySize, createProgram, createShader } from '../utils/webglUtils';
import { drawRectangle } from '../utils/drawFigures';
import TestSlider from '../components/slider';


function setupWebGL(gl: WebGL2RenderingContext): [WebGL2RenderingContext, number, WebGLUniformLocation] {
  // Get A WebGL context
  if (!gl) {
    return [gl, 0, new WebGLUniformLocation()];
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

  return [gl, positionAttributeLocation, colorLocation];
}

function draw(
  xPosition: number, yPosition: number,
  gl: WebGL2RenderingContext, positionAttributeLocation: number,
  colorLocation: WebGLUniformLocation
) {
  // draw

  var args: Array<number> = [xPosition, yPosition, .1, .1];
  drawRectangle(gl, positionAttributeLocation, colorLocation, args);
}

type CanvasProps = {
  xPosition: number,
  yPosition: number,
}

type CanvasState = {
  gl: WebGL2RenderingContext,
  positionAttributeLocation: number,
  colorLocation: WebGLUniformLocation,
  xPosition: number,
  yPosition: number,
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  canvas: React.RefObject<HTMLCanvasElement>

  constructor(props: CanvasProps) {
    super(props);

    this.setState({ xPosition: props.xPosition, yPosition: props.yPosition });
    this.canvas = React.createRef();
  }

  componentDidMount() {
    if (this.canvas.current === null) {
      return;
    }
    var context = this.canvas.current.getContext("webgl2") as WebGL2RenderingContext;
    var [gl, pos, color] = setupWebGL(context);
    this.setState({ gl: gl, positionAttributeLocation: pos, colorLocation: color });
    draw(0, 0, gl, pos, color);
    // this.updateCanvas();
  }

  updateCanvas() {
    this.setState({ xPosition: this.props.xPosition, yPosition: this.props.yPosition });
    draw(this.state.xPosition, this.state.yPosition, this.state.gl,
      this.state.positionAttributeLocation, this.state.colorLocation);
  }

  // componentDidUpdate(props: CanvasProps) {
  //   if (this.props.xPosition !== props.xPosition || this.props.yPosition !== props.yPosition) {
  //     this.setState({ xPosition: props.xPosition, yPosition: props.yPosition });
  //     draw(props.xPosition, props.yPosition, this.state.gl,
  //       this.state.positionAttributeLocation, this.state.colorLocation);
  //   }
  // }

  render(): React.ReactNode {
    // useEffect(() => {
    //   draw(this.state.xPosition, this.state.yPosition, this.state.gl, 
    //        this.state.positionAttributeLocation, this.state.colorLocation);
    // }, [this.state])
    return (
      <div>
        <canvas id="c" ref={this.canvas}></canvas>
      </div>
    );
  }
}


type Props = {};
type State = {
  xPosition: number,
  yPosition: number,
}

export default class Tuto4 extends React.Component<Props, State> {
  canvas: React.RefObject<Canvas>;

  constructor(props: Props) {
    super(props);

    this.state = { xPosition: 0, yPosition: 0 };

    // this.handleSliderChange = this.handleSliderChange.bind(this);
    this.canvas = React.createRef();
  }

  handleSliderChange(val: number, coord: string) {
    if (val === null || this.canvas.current === null) {
      return;
    }
    if (coord === 'x') {
      this.setState({ xPosition: val });
      // update canvas
    }
    else if (coord === 'y') {
      this.setState({ yPosition: val });
    }

    this.canvas.current.updateCanvas();
  };

  render(): JSX.Element {
    return (
      <div>
        <div className='canvas-div'>
        <Canvas xPosition={this.state.xPosition} yPosition={this.state.yPosition} ref={this.canvas}></Canvas>
        </div>        
        <div className='sliders-div'>
          <TestSlider min={-1} max={1} step={0.01} name="x position"
            onChange={(val: number) => this.handleSliderChange(val, 'x')}
          />
          <TestSlider min={-1} max={1} step={0.01} name="y position"
            onChange={(val: number) => this.handleSliderChange(val, 'y')}
          />
        </div>
      </div>
    );
  }
}
