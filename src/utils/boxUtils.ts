import * as THREE from 'three';
import Box from './box';


export default class BoxUtils {

  public static BoxToThree(
    box: Box,
    material: THREE.Material = new THREE.MeshPhongMaterial({color: 0x44aa88})
  ): THREE.Mesh {
    const geometry = BoxUtils.BoxGeometry(box);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  public static BoxGeometry(box: Box): THREE.BoxGeometry {
    let geometry = new THREE.BoxGeometry(box.depth, box.height, box.width);
    let x = box.vertices.b0[1];
    let y = box.vertices.b0[2];
    let z = box.vertices.b0[0];
    geometry.translate(x + box.depth / 2, y + box.height / 2, z + box.width / 2);

    return geometry;
  }

  public static BoxEdges(box: Box): THREE.LineSegments {
    let geometry = BoxUtils.BoxGeometry(box);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000}));

    return line;
  }

  public static scenario1(): Box[] {
    return [
      new Box([10, 0, 12], 1, 1, 1),
      new Box([0, 0, 0], 3, 2, 5),
      new Box([12, 0, 0], 3, 2, 5),
      new Box([10, 3, 0], 2, 1, 4),
      new Box([2, 4, 1], 1, 10, 3),
      new Box([5, 12, 0], 2, 2, 14),
      new Box([1, 0, 12], 1, 1, 1),
      new Box([0, 0, 8], 1, 1, 1),
      new Box([0, 3, 8], 1, 1, 1),
      new Box([10, 0, 12], 1, 1, 1),
    ];
  }
}

