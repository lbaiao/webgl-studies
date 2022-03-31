export function degToRad(angle: number): number {
  var rad = angle / 180 * Math.PI;
  return rad;
}

export function scale(val: number, oldMin: number, 
                      oldMax: number, newMin: number, newMax: number) : number {
  let newVal = (val - oldMin) / (oldMax - oldMin) * (newMax - newMin) + newMin;
  return newVal;
}


// checks if the coordinates of vecA are greater than the
// coordinates of vecB
export function vecGreaterOrEqual(vecA: number[], vecB: number[]) {
  if (vecA.length !== vecB.length) {
    return;
  }

  for (let i=0; i < vecA.length; i++) {
    if (vecA[i] < vecB[i]) {
      return false;
    }
  }

  return true;
}


export function vecSum(vecA: number[], vecB: number[]) {
  if (vecA.length !== vecB.length) {
    return [];
  }

  let res = [];
  for (let i=0; i < vecA.length; i++) {
    res.push(vecA[i] + vecB[i]);
  }

  return res;
}

export function vecSub(vecA: number[], vecB: number[]) {
  if (vecA.length !== vecB.length) {
    return [];
  }

  let res = [];
  for (let i=0; i < vecA.length; i++) {
    res.push(vecA[i] - vecB[i]);
  }

  return res;
}
