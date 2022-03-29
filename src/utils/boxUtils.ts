import * as THREE from 'three';
import Box from './box';


export function BoxToThree(box: Box) : THREE.Mesh {
  let geometry = new THREE.BoxGeometry(box.depth, box.height, box.width);
  let x = box.vertices.b0[1];
  let y = box.vertices.b0[2];
  let z = box.vertices.b0[0];
  geometry.translate(x + box.depth / 2, y + box.height / 2, z + box.width / 2);
  const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;
}


export var scenario1: Box[] = [
  new Box([0, 0, 0], 3, 2, 5),
  new Box([5, 0, 0], 3, 2, 5),
  new Box([5, 3, 0], 2, 1, 4),
  new Box([2, 4, 1], 1, 3, 3),
  new Box([1, 8, 0], 2, 2, 9),
];
