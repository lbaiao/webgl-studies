import React from 'react';
import TestSlider from '../components/slider';
import { degToRad } from '../utils/mathUtils';
import * as THREE from 'three';
import {resizeCanvasToDisplaySize} from '../utils/webglUtils';



type CanvasProps = {
  translation: Array<number>,
  xRotation: number,
  yRotation: number,
  zRotation: number,
  scaling: Array<number>,
}

type CanvasState = {
  camera?: THREE.PerspectiveCamera;
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  canvas: React.RefObject<HTMLCanvasElement>;
  renderer?: THREE.WebGLRenderer;
  scene: THREE.Scene;

  constructor(props: CanvasProps) {
    super(props);

    this.canvas = React.createRef();
    this.scene = new THREE.Scene();
  }

  componentDidMount() {
    if (this.canvas.current === null) {
      return;
    }

    const context = this.canvas.current.getContext("webgl") as WebGL2RenderingContext;
    const params = {
      domElement: this.canvas.current,
      context: context,
    } as THREE.WebGLRendererParameters;

    const renderer = new THREE.WebGLRenderer(params);
    const canvas = this.canvas.current;
    resizeCanvasToDisplaySize(canvas, 1);
    renderer.setSize(canvas.width, canvas.height, false);
    this.renderer = renderer;
    const camera = this.setupCamera(canvas);
    this.setState({camera: camera});

    this.animateCube(renderer, camera);
  }

  setupCamera(canvas: HTMLCanvasElement) {
    console.log(canvas.width);
    console.log(canvas.height);
    console.log(canvas.clientWidth);
    console.log(canvas.clientHeight);
    const fov = 75;
    const aspect = canvas.width / canvas.height;
    //const aspect = 2;
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;
    camera.updateProjectionMatrix();
    return camera; 
  }

  setupBox(): THREE.Object3D {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    //const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
    const cube = new THREE.Mesh(geometry, material);

    return cube;
  }

  updateCanvas() {
    if (this.renderer === undefined) {
      return;
    }
    //this.scene.add(cube);
    //this.renderer.render(this.scene, this.camera!);
    //this.animateCube();
  }

  animateCube(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera) {
    console.log(this);
    const cube = this.setupBox();
    const scene = this.scene;
    const light = this.setupLight();

    scene.add(cube);
    scene.add(light);

    function renderAnimation(time: number) {
      time *= 0.001;  // convert time to seconds

      cube.rotation.x = time;
      cube.rotation.y = time;
     
      renderer.render(scene, camera);
      requestAnimationFrame(renderAnimation);
    }

    requestAnimationFrame(renderAnimation);
  }


  setupLight() {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      return light;
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
  xRotation: number,
  yRotation: number,
  zRotation: number,
  scaling: Array<number>,
}

export default class Tuto10 extends React.Component<Props, State> {
  canvas: React.RefObject<Canvas>;

  constructor(props: Props) {
    super(props);

    this.state = { 
      translation: [0, 0], 
      xRotation: 0, 
      yRotation: 0, 
      zRotation: 0, 
      scaling: [1, 1] 
    };

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
      case 'xRotation':
        this.setState({ xRotation: val })
        break;
      case 'yRotation':
        this.setState({ yRotation: val })
        break;
      case 'zRotation':
        this.setState({ zRotation: val })
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
          <Canvas 
            translation={this.state.translation}
            xRotation={this.state.xRotation} 
            yRotation={this.state.yRotation} 
            zRotation={this.state.zRotation} 
            ref={this.canvas}
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
          <TestSlider min={0} max={360} step={0.01} name="x rotation"
            onChange={(val: number) => this.handleSliderChange(val, 'xRotation')}
          />
          <TestSlider min={0} max={360} step={0.01} name="y rotation"
            onChange={(val: number) => this.handleSliderChange(val, 'yRotation')}
          />
          <TestSlider min={0} max={360} step={0.01} name="z rotation"
            onChange={(val: number) => this.handleSliderChange(val, 'zRotation')}
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
