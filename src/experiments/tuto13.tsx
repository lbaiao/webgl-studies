import React from 'react';
import { OrbitControls } from '../utils/OrbitControls';
import * as THREE from 'three';
import {resizeCanvasToDisplaySize} from '../utils/webglUtils';
import Box from '../utils/box';
import BoxUtils from '../utils/boxUtils';
import Octree, { NodeType } from '../utils/octree';
import OctreeUtils from '../utils/octreeUtils';
import { tests } from '../tests/tests';


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


  animateCube(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera) {
    //tests();
    OctreeUtils.Scenario2();

    const meshes = BoxUtils.scenario1().map(x => BoxUtils.BoxToThree(x));
    const scene = this.scene;
    const light = this.setupLight();
    const canvas = this.canvas.current!;

    const octree = OctreeUtils.Scenario1();
    console.log(octree);
    //const regionMesh = OctreeUtils.RegionToThree(octree);
    //const octantMeshes = OctreeUtils.OctantsToThree(octree);
    const octants = octree.getAllOctantsList();
    octants.push(octree);
    const octEdges = octants
      .filter(x => x.nodeType !== NodeType.EMPTY)
      .map(x => BoxUtils.BoxEdges(x.region));

    //const regionOcts = octants.filter(x => x.nodeType === NodeType.LEAF);
    //const regionMeshes = regionOcts.map(x => BoxUtils.BoxEdges(x.region));
    //console.log(regionOcts);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    meshes.forEach(x => scene.add(x));
    //scene.add(regionMesh);
    //octantMeshes.forEach(x => scene.add(x));
    octEdges.forEach(x => scene.add(x));
    //regionMeshes.forEach(x => scene.add(x));
    //scene.add(regionMeshes[2]);
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


  export default class Tuto13 extends React.Component<Props> {
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
