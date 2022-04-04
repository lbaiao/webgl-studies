import Octree from "../octree/octree";
import Box from "../utils/box";


export function testOctree() {
  console.log('Octree constructor');

  const ocBox = new Box([0, 0, 0], 16, 16, 16);
  const octree = Octree.makeBox(ocBox);
  return true;
}
