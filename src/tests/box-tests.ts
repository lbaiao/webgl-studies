import Box from '../utils/box';

export function testBox() {
  // constructor
  const box1 = new Box([0, 0, 0], 16, 16, 16);
  console.log('constructor');
  console.log(box1.center);
  console.log(box1.vertices);

  // from points
  console.log('fromPoints');
  const b0 = [0, 0, 0];
  const t2 = [5, 5, 5];
  const box2 = Box.fromPoints(b0, t2);
  console.log(box2.center);
  console.log(box2.vertices);
}

export function containsTrue() {
  console.log('Box containsTrue');
  const p0 = [0, 0, 0];
  const box1 = new Box(p0, 16, 16, 16);
  const box2 = new Box(p0, 5, 5, 5);

  const res = box1.contains(box2);
  console.log(res);
  return res;
}

export function containsFalse() {
  console.log('Box containsFalse');
  const p0 = [0, 0, 0];
  const box1 = new Box(p0, 5, 5, 16);
  const box2 = new Box(p0, 5, 6, 5);

  const res = !box1.contains(box2);
  console.log(res);
  return res;
}
