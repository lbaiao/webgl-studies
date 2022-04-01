import * as THREE from 'three';
import Octree from "./octree";
import BoxUtils from "./boxUtils";
import Box from './box';


export default class OctreeUtils {
  public static RegionToThree(octree: Octree) {
    const region = octree.region;
    const material = new THREE.MeshPhongMaterial({
      color: 0x44aa88,
      transparent: true,
      opacity: .5,
    });
    const mesh = BoxUtils.BoxToThree(region, material);
    return mesh;
  }

    public static OctantsToThree(octree: Octree) : THREE.Mesh[]{
    if (octree.childrenOctants === undefined) {
      return [];
    }

    const regions = octree.getChildrenOctantsList().map(x => x.region);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFFaa88,
      transparent: true,
      opacity: .8,
    });
    const meshes = regions.map(x => BoxUtils.BoxToThree(x, material));
    return meshes;
  }

  public static Scenario1() : Octree {
    const ocBox = new Box([0, 0, 0], 16, 16, 16);
    const octree = Octree.makeBox(ocBox);
    const objects = BoxUtils.scenario1();

    objects.forEach(x => octree.insert(x));

    return octree;
  }

  public static Scenario2() {
    const octree = OctreeUtils.Scenario1();
    //const box = new Box([15, 7, 0], 1, 1, 1);
    const box = new Box([8, 0, 0], 1, 1, 1);

    const collisions = octree.possibleCollisions(box);
    console.log('collisions');
    console.log(collisions);
  }
}




