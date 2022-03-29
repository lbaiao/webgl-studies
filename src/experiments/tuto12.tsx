import React from 'react';
import { OrbitControls } from '../utils/OrbitControls';
import * as THREE from 'three';
import {resizeCanvasToDisplaySize} from '../utils/webglUtils';



type CanvasState = {
  camera?: THREE.PerspectiveCamera;
}

class Canvas extends React.Component<Props, CanvasState> {
  canvas: React.RefObject<HTMLCanvasElement>;
  renderer?: THREE.WebGLRenderer;
  scene: THREE.Scene;

  constructor(props: Props) {
    super(props);

    this.canvas = React.createRef();
    this.scene = new THREE.Scene();
  }

  componentDidMount() {
    if (this.canvas.current === null) {
      return;
    }

    const context = this.canvas.current.getContext("webgl") as WebGLRenderingContext;
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
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
    const cube = new THREE.Mesh(geometry, material);

    return cube;
  }

  updateCanvas() {
    if (this.renderer === undefined) {
      return;
    }
  }

  animateCube(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera) {
    console.log(this);

    const cube = this.setupBox();
    const scene = this.scene;
    const light = this.setupLight();
    const canvas = this.canvas.current!;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(cube);
    scene.add(light);

    function renderAnimation() {
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


export default class Tuto12 extends React.Component<Props> {
  canvas: React.RefObject<Canvas>;

  constructor(props: Props) {
    super(props);
    this.canvas = React.createRef();
  }

  render(): JSX.Element {
    return (
      <div>
        <div className='canvas-div'>
          <Canvas 
            ref={this.canvas}
          ></Canvas>
        </div>
      </div>
    );
  }
}
