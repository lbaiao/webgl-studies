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
  vertices!: BoxVertices;

  constructor(p: number[], width: number, depth: number, height: number) {
    if (p.length !== 3
      || width <= 0
      || depth <= 0
      || height <= 0) {
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
