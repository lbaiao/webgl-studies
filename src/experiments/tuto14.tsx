import React from 'react';
import { OrbitControls } from '../utils/OrbitControls';
import * as THREE from 'three';
import {resizeCanvasToDisplaySize} from '../utils/webglUtils';
import Box from '../utils/box';
import BoxUtils from '../utils/boxUtils';
import Octree, { NodeType } from '../utils/octree';
import OctreeUtils from '../utils/octreeUtils';
import { tests } from '../tests/tests';
import TestSlider from '../components/slider';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from "@material-ui/core";


type CanvasState = {
  camera?: THREE.PerspectiveCamera;
}

type CanvasProps = {
  collisionBoxPosition: number[],
  collision: boolean;
}

enum BoxEvents {
  TRANSLATE_X = 0,
  TRANSLATE_Y = 1,
  TRANSLATE_Z = 2,
  WIDTH = 3,
  DEPTH = 4,
  HEIGHT = 5,
  COLLISION = 6,
}

class Canvas extends React.Component<CanvasProps, CanvasState> {
  canvas: React.RefObject<HTMLCanvasElement>;
  renderer?: THREE.WebGLRenderer;
  scene: THREE.Scene;
  collisionBox: Box = new Box([0, 0, 0], 4, 4, 4);
  cBoxPosition: number[] = [0, 0, 0];
  shouldTranslate: boolean[] = [false, false, false];
  collision: boolean;

  constructor(props: CanvasProps) {
    super(props);

    this.canvas = React.createRef();
    this.scene = new THREE.Scene();

    this.cBoxPosition = this.props.collisionBoxPosition;
    this.collision = this.props.collision;
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

    this.animate(renderer, camera);
  }

  setupCamera(canvas: HTMLCanvasElement) {
    const fov = 75;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 50;
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

  public updateState(event: BoxEvents) {
    switch(event) {
      case BoxEvents.TRANSLATE_X:
        this.cBoxPosition = this.props.collisionBoxPosition;
        this.shouldTranslate[0] = true;
        break;

      case BoxEvents.TRANSLATE_Y:
        this.cBoxPosition = this.props.collisionBoxPosition;
        this.shouldTranslate[1] = true;
        break;

      case BoxEvents.TRANSLATE_Z:
        this.cBoxPosition = this.props.collisionBoxPosition;
        this.shouldTranslate[2] = true;
        break;

      default:
        break;
    }
    //console.log(this.cBoxPosition);
    //console.log(this.collisionBox.vertices);
  }

  animate(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera) {
    //OctreeUtils.Scenario2();

    const meshesMaterial = new THREE.MeshPhongMaterial({
      color: 0x44aa88,
      transparent: true,
      opacity: .6,
    });
    const meshes = BoxUtils.scenario1().map(x => BoxUtils.BoxToThree(x, meshesMaterial));
    const scene = this.scene;
    const collisionScene = new THREE.Scene();
    const light = this.setupLight();
    const canvas = this.canvas.current!;

    const octree = OctreeUtils.Scenario1();
    //console.log(octree);
    const octants = octree.getAllOctantsList();
    octants.push(octree);
    const octEdges = octants
      .filter(x => x.nodeType !== NodeType.EMPTY)
      .map(x => BoxUtils.BoxEdges(x.region));

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const cBoxMesh = BoxUtils.BoxToThree(
      this.collisionBox,
      new THREE.MeshPhongMaterial({color: 0xFFaaaa})
    );

    // scene 1
    meshes.forEach(x => scene.add(x));
    octEdges.forEach(x => scene.add(x));
    scene.add(light);

    // collision scene
    collisionScene.add(light.clone());
    octEdges.forEach(x => collisionScene.add(x.clone()));

    const component: Canvas = this;
    let previousCollisionsMeshes: THREE.Mesh[] = [];

    //let counter = 0;
    let lastCBoxPosition = component.collisionBox.vertices.b0;
    function renderAnimation() {
      // move collisionBox
      if (component.shouldTranslate[0]) {
        component.collisionBox.moveX(component.cBoxPosition[0]);
        cBoxMesh.translateZ(component.cBoxPosition[0] - lastCBoxPosition[0]);
        lastCBoxPosition = component.cBoxPosition;
        component.shouldTranslate[0] = false;
      }

      else if (component.shouldTranslate[1]) {
        component.collisionBox.moveY(component.cBoxPosition[1]);
        cBoxMesh.translateX(component.cBoxPosition[1] - lastCBoxPosition[1]);
        lastCBoxPosition = component.cBoxPosition;
        component.shouldTranslate[1] = false;
      }

      else if (component.shouldTranslate[2]) {
        component.collisionBox.moveZ(component.cBoxPosition[2]);
        cBoxMesh.translateY(component.cBoxPosition[2] - lastCBoxPosition[2]);
        lastCBoxPosition = component.cBoxPosition;
        component.shouldTranslate[2] = false;
      }

      if (component.props.collision) {
        previousCollisionsMeshes.forEach(x => collisionScene.remove(x));

        const collisionCandidates = octree.possibleCollisions(component.collisionBox);
        if (collisionCandidates !== null) {
          let collisionCandidatesMeshes = collisionCandidates.map(x => BoxUtils.BoxToThree(x));
          collisionCandidatesMeshes.forEach(x => collisionScene.add(x));
          previousCollisionsMeshes = collisionCandidatesMeshes;
        }
        else {
          previousCollisionsMeshes = [];
        }

        collisionScene.add(cBoxMesh);
        renderer.render(collisionScene, camera);
      }

      else {
        scene.add(cBoxMesh);
        renderer.render(scene, camera);
      }

      requestAnimationFrame(renderAnimation);
      //
      // logs
      //if (counter % 100 === 0) {
      //}

      //counter ++;
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
  xPosition: number,
  yPosition: number,
  zPosition: number,
  collision: boolean,
};


export default class Tuto14 extends React.Component<Props, State> {
  canvas: React.RefObject<Canvas>;

  constructor(props: Props) {
    super(props);
    this.canvas = React.createRef();

    this.state = {xPosition: 0, yPosition: 0, zPosition: 0, collision: false};
  }

  handleSliderChange(val: number, event: BoxEvents) {
    switch(event) {
      case BoxEvents.TRANSLATE_X:
        this.setState({xPosition: val});
        break;

      case BoxEvents.TRANSLATE_Y:
        this.setState({yPosition: val});
        break;

      case BoxEvents.TRANSLATE_Z:
        this.setState({zPosition: val});
        break;

      default:
        break;
    }

    this.canvas.current!.updateState(event);
  }

  handleCheckbox() {
    this.setState({collision: !this.state.collision});
  }

  render(): JSX.Element {
    return (
      <div>
        <div className='canvas-div'>
          <Canvas
            ref={this.canvas}
            collisionBoxPosition={[this.state.xPosition, this.state.yPosition, this.state.zPosition]}
            collision={this.state.collision}
          ></Canvas>
        </div>
        <div className='sliders-div'>
          <div>
            <Typography gutterBottom>
              Collision
              <Checkbox onChange={() => this.handleCheckbox()}></Checkbox>
            </Typography>
          </div>
          <TestSlider min={0} max={16} step={0.01} name="x position"
            onChange={(val: number) => this.handleSliderChange(val, BoxEvents.TRANSLATE_X)}
          />
          <TestSlider min={0} max={16} step={0.01} name="y position"
            onChange={(val: number) => this.handleSliderChange(val, BoxEvents.TRANSLATE_Y)}
          />
          <TestSlider min={0} max={16} step={0.01} name="z position"
            onChange={(val: number) => this.handleSliderChange(val, BoxEvents.TRANSLATE_Z)}
          />
          <TestSlider min={0} max={16} step={0.01} name="width"
            onChange={(val: number) => this.handleSliderChange(val, BoxEvents.WIDTH)}
          />
          <TestSlider min={0} max={16} step={0.01} name="depth"
            onChange={(val: number) => this.handleSliderChange(val, BoxEvents.DEPTH)}
          />
          <TestSlider min={0} max={16} step={0.01} name="height"
            onChange={(val: number) => this.handleSliderChange(val, BoxEvents.HEIGHT)}
          />
        </div>
      </div>
    );
  }
}
