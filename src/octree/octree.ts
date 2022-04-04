import Box from '../utils/box';
import {vecSum, vecSub} from '../utils/mathUtils';

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

export enum NodeType {
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
  maxObjects: number = 10;

  private constructor(
    region: Box,
    nodeType: NodeType = NodeType.EMPTY,
    maxObjects = 10,
  ) {
    this.region = region;
    this.nodeType = nodeType;
    this.maxObjects = maxObjects;
  }

  public static makeBox(
    region: Box,
    nodeType: NodeType = NodeType.EMPTY,
    maxObjects = 10,
  ) {
    if (region.width !== region.height
      || region.width !== region.depth
      || region.height !== region.depth
    ) {
      let fakeBox = new Box([0, 0, 0], 1, 1, 1);
      return new Octree(fakeBox);
    }

    return new Octree(region, nodeType, maxObjects);
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

    this.getChildrenOctantsList().forEach(x => x.parent = this);
  }

  getChildrenOctantsList() {
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

    const childrenOctants = this.getChildrenOctantsList();
    childrenOctants.forEach(x => {
      octants.push(x);
      let octs = x.getAllOctantsList();
      octs.forEach(y => octants.push(y));
    });

    return octants;
  }

  handleLeafInsertion(box: Box) {
    // if the node's region cannot be divided any longer
    if (this.objects.length < this.maxObjects
        || this.region.width / 2 < this.minSize) {
      this.objects.push(box);
      this.nodeType = NodeType.REGION;
      return;
    }

    this.makeOctants();
    this.passObjectsToChildren();

    this.nodeType = NodeType.REGION;
  }

  handleRegionInsertion(box: Box) {
    let childrenIsUndefined = this.childrenOctants === undefined;
    let objectQtyIsOK = this.objects.length < this.maxObjects;
    let childrenSizeIsOK = this.region.width / 2 >= this.minSize;

    if (childrenIsUndefined) {
      if (!childrenSizeIsOK || objectQtyIsOK) { 
        this.objects.push(box); 
        return;
      }

      else if (!objectQtyIsOK && childrenSizeIsOK) {
        this.makeOctants();
      }
    }

    this.objects.push(box);
    this.passObjectsToChildren();
  }

  passObjectsToChildren() {
    const childrenOctants = this.getChildrenOctantsList();

    let notInsertedMask: boolean[] = [];
    this.objects.forEach(x => {
      let inserted = 0;
      for (let i = 0; i < 8; i++) {
        let oct = childrenOctants[i];
        let aux = oct.insert(x);
        if (aux) { inserted++ };
      }
      
      notInsertedMask.push(inserted === 0);
    });

    this.objects = this.objects.filter((_, i) => notInsertedMask[i]);
  }

  insert(box: Box): boolean {
    if (this.region.contains(box) || this.region.intersectAABB(box)) {

      switch (this.nodeType) {
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

    else {
      return false;
    }
  }

  private getParentsObjects() {
    const parentsObjects: Box[] = [];
    if (this.parent !== undefined) {
      this.parent.objects.forEach(x => parentsObjects.push(x));

      const gParentObjects = this.parent.getParentsObjects();
      gParentObjects.forEach(x => parentsObjects.push(x));
    }

    return parentsObjects;
  }

  // return the elements that may collide with box
  public possibleCollisions(box: Box): Box[] | null {
    if (this.region.intersectAABB(box)
      || this.region.contains(box)) {
      return this.possibleCollisionsAux(box);
    }

    else {
      return null;
    }
  }

  private possibleCollisionsAux(box: Box): Box[] {
    let intersections: Box[] = [];

    switch (this.nodeType) {
      case NodeType.LEAF:
        intersections.push(this.objects[0]);
        return intersections;

      case NodeType.REGION:
        this.objects.forEach(x => intersections.push(x));

        if (this.childrenOctants === undefined) {
          return intersections;
        }

        let children = this.getChildrenOctantsList();
        let childContainsBox = false;

        for (let i = 0; i < 8; i++) {
          let child = children[i];
          childContainsBox = child.region.contains(box) || child.region.intersectAABB(box) as boolean;

          if (childContainsBox) {
            let childIntersections = child.possibleCollisionsAux(box);
            childIntersections.forEach(x => intersections.push(x));
          }
        }

        return intersections;

      default:
        return intersections;
    }
  }
}
