import Box from './box';
import { vecSum, vecSub } from './mathUtils';

type Octants = {
  b0: Octree,
  b1: Octree,
  b2: Octree,
  b3: Octree,
  t0: Octree,
  t1: Octree,
  t2: Octree,
  t3: Octree,
}

enum NodeType {
  EMPTY = 0,
  LEAF = 1,
  REGION = 2,
}

export default class Octree {
  // 0 ------ 3
  // |        |
  // 1 ------ 2
  // b: bottom octants
  // t: top octants
  region: Box;
  childrenOctants?: Octants;
  minSize: number = 1;
  nodeType: NodeType = NodeType.EMPTY;
  objects: Box[] = []
  parent?: Octree;

  private constructor(
    region: Box,
    nodeType: NodeType = NodeType.EMPTY,
  ) {
    this.region = region;
    this.nodeType = nodeType;
  }

  public static makeBox(
    region: Box,
    nodeType: NodeType = NodeType.EMPTY,
  ) {
    if (region.width !== region.height
      || region.width !== region.depth
      || region.height !== region.depth
    ) {
      let fakeBox = new Box([0, 0, 0], 1, 1, 1);
      return new Octree(fakeBox);
    }

    return new Octree(region, nodeType);
  }

  makeOctants() {
    const region = this.region;
    const center = region.center;
    const halfWidth = this.region.width / 2;
    const halfDepth = this.region.depth / 2;
    const halfHeight = this.region.height / 2;

    // bottom octants
    const b0 = Box.fromPoints(region.vertices.b0, center);
    const b1 = Box.fromPoints(
      vecSum(region.vertices.b0, [halfWidth, 0, 0]), 
      vecSum(center, [halfWidth, 0, 0])
    );
    const b2 = Box.fromPoints(
      vecSub(center, [0, 0, halfHeight]),
      vecSum(center, [halfWidth, halfDepth, 0])
    );
    const b3 = Box.fromPoints(
      vecSum(region.vertices.b0, [0, halfDepth, 0]),
      vecSum(center, [0, halfDepth, 0])
    );

    // top octants
    let aux = [0, 0, halfHeight];
    const t0 = Box.fromPoints(
      vecSum(region.vertices.b0, aux),
      vecSum(center, aux),
    );
    const t1 = Box.fromPoints(
      b1.vertices.t0,
      vecSum(b1.vertices.t2, aux)
    );
    const t2 = Box.fromPoints(
      center,
      vecSum(b2.vertices.t2, aux)
    );
    const t3 = Box.fromPoints(
      b3.vertices.t0,
      vecSum(b3.vertices.t2, aux)
    );

    this.childrenOctants = {
      b0: new Octree(b0), 
      b1: new Octree(b1), 
      b2: new Octree(b2), 
      b3: new Octree(b3),
      t0: new Octree(t0), 
      t1: new Octree(t1), 
      t2: new Octree(t2), 
      t3: new Octree(t3),
    };

    this.getOctantsList().forEach(x => x.parent = this);
  }

  getOctantsList() {
    let octants: Octree[] = [];
    if (this.childrenOctants !== undefined) {
      octants = [
        this.childrenOctants.b0,
        this.childrenOctants.b1,
        this.childrenOctants.b2,
        this.childrenOctants.b3,
        this.childrenOctants.t0,
        this.childrenOctants.t1,
        this.childrenOctants.t2,
        this.childrenOctants.t3,
      ];
    }

    return octants;
  }

  getAllOctantsList() {
    const octants: Octree[] = [];

    const childrenOctants = this.getOctantsList();
    childrenOctants.forEach(x => octants.push(x));

    if (this.childrenOctants !== undefined) {
      childrenOctants.forEach(x => {
        let octs = x.getOctantsList();
        octs.forEach(y => octants.push(y));
      });
    }

    return octants;
  }

  handleLeafInsertion(box: Box) {
    if (this.region.width / 2 <= this.minSize) {
      this.objects.push(box);
      return;
    }

    if (this.objects.length !== 1) {
      console.log('leaf node had more than one object');
    }

    this.makeOctants();
    const childrenOctants = this.getOctantsList();

    // deal with firstObject
    const firstObject = this.objects[0];
    for (let i = 0; i < 8; i++) {
      let oct = childrenOctants[i];
      let inserted = oct.insert(firstObject);
      if (inserted) {
        this.objects.pop();
        break;
      }
    }

    // deal with new object
    let boxAssigned = false;
    for (let i = 0; i < 8; i++) {
      let oct = childrenOctants[i];
      boxAssigned = oct.insert(box);
      if (boxAssigned) {
        break;
      }
    }

    if (!boxAssigned) {
      this.objects.push(box);
    }

    this.nodeType = NodeType.REGION;
  }

  handleRegionInsertion(box: Box) {
    const childrenOctants = this.getOctantsList();

    let boxAssigned = false;
    for (let i = 0; i < 8; i++) {
      let oct = childrenOctants[i];
      boxAssigned = oct.insert(box);
      if (boxAssigned) {
        break;
      }
    }

    if (!boxAssigned) {
      this.objects.push(box);
    }
  }

  insert(box: Box) : boolean {
    if (!this.region.contains(box)) {
       return false;
    }

    switch(this.nodeType) {
      case NodeType.EMPTY:
        this.objects.push(box);
        this.nodeType = NodeType.LEAF;
        break;
      case NodeType.LEAF:
        this.handleLeafInsertion(box);
        break;
      case NodeType.REGION:
        this.handleRegionInsertion(box);
        break;
      default:
        break;
    }

    return true;
  }
}
