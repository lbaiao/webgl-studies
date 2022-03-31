import * as BoxTests from './box-tests';
import * as MathTests from './math-tests';
import * as OctreeTests from './octree-tests';


export function tests() {
  // box
  BoxTests.testBox();
  BoxTests.containsTrue();
  BoxTests.containsFalse();

  // math
  MathTests.testSum();
  MathTests.testSub();

  // octree
  OctreeTests.testOctree();
}
