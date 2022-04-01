import { vecGreaterOrEqual } from './mathUtils';


// 0 ------ 3
// |        |
// 1 ------ 2
// b: bottom rectangle
// t: top rectangle
type BoxVertices = {
  b0: number[],
  b1: number[],
  b2: number[],
  b3: number[],
  t0: number[],
  t1: number[],
  t2: number[],
  t3: number[],
}

export default class Box {
  height: number = 0;
  depth: number = 0;
  width: number = 0;
  center: number[] = [];
  vertices: BoxVertices;

  constructor(p: number[], width: number, depth: number, height: number) {
    this.vertices = {b0: [], b1: [], b2: [], b3: [], t0: [], t1: [], t2: [], t3: []};

    if (p.length !== 3
      || width < 0
      || depth < 0
      || height < 0) {
      return;
    }

    if (p === undefined
      || width === undefined
      || depth === undefined
      || height === undefined) {
      return;
    }

    let center = [
      p[0] + width / 2,
      p[1] + depth / 2,
      p[2] + height / 2,
    ];

    const vertices: BoxVertices = {
      b0: p,
      b1: [p[0], p[1] + depth, p[2]],
      b2: [p[0] + width, p[1] + depth, p[2]],
      b3: [p[0] + width, p[1], p[2]],

      t0: [p[0], p[1], p[2] + height],
      t1: [p[0], p[1] + depth, p[2] + height],
      t2: [p[0] + width, p[1] + depth, p[2] + height],
      t3: [p[0] + width, p[1], p[2] + height],
    };

    this.height = height;
    this.width = width;
    this.depth = depth;
    this.center = center;
    this.vertices = vertices;
  }

  public static fromPoints(b0: number[], t2: number[]) {
    if (t2[0] <= b0[0]
      || t2[1] <= b0[1]
      || t2[2] <= b0[2]) {
      return new Box([0, 0, 0], 0, 0, 0);
    }

    let width = t2[0] - b0[0];
    let depth = t2[1] - b0[1];
    let height = t2[2] - b0[2];

    const box = new Box(b0, width, depth, height);
    return box;
  }

  contains(box: Box) {
    return vecGreaterOrEqual(box.vertices.b0, this.vertices.b0)
      && vecGreaterOrEqual(this.vertices.t2, box.vertices.t2);
  }

  intersectAABB(boxA: Box, boxB: Box) : boolean {
    const aMin = boxA.vertices.b0;
    const aMax = boxA.vertices.t2;
    const bMin = boxB.vertices.b0;
    const bMax = boxB.vertices.t2;

    return (aMin[0] <= bMax[0] && aMax[0] >= bMin[0]) &&
      (aMin[1] <= bMax[1] && aMax[1] >= bMin[1]) &&
      (aMin[2] <= bMax[2] && aMax[2] >= bMin[2]);
  }

  //public static randomBox(
    //minX: number, minY: number,
    //minZ: number, maxX: number,
    //maxY: number, maxZ: number,
    //minLength: number, minWidth: number,
    //minHeight: number, maxLength: number,
    //maxWidth: number, maxHeight: number,
  //) {
  //}
}

