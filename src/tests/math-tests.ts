import { vecSub, vecSum } from "../utils/mathUtils";


export function testSum() {
  const vecA = [1, 2, 3];
  const vecB = [4, 5, 6];
  const sum = vecSum(vecA, vecB);
  const ref = [5, 7, 9];
  var res = true;

  for (let i=0; i < 3; i++) {
    if (sum[i] !== ref[i]) {
      res = false;
      break;
    }
  }

  console.log('testSum');
  console.log(res);
  return res;
}

export function testSub() {
  const vecA = [1, 2, 3];
  const vecB = [4, 5, 6];
  const sum = vecSub(vecA, vecB);
  var ref = [-3, -3, -3];
  var res = true;

  for (let i=0; i < 3; i++) {
    if (sum[i] !== ref[i]) {
      res = false;
      break;
    }
  }

  console.log('testSub');
  console.log(res);
  return res;
}
