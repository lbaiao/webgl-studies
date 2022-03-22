/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

// import { mat4 } from './mathmatrix';

export class mat3 extends Float32Array {        
    constructor() {
        super(9);
        this.create();        
    }

    /**
    * Creates a new identity mat3
    *
    * @returns {mat3} a new 3x3 matrix
    */
    public create(): Float32Array {        
        this[0] = 1;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 1;
        this[5] = 0;
        this[6] = 0;
        this[7] = 0;
        this[8] = 1;
        return this;
    };

    /**
    * Copies the upper-left 3x3 values into the given mat3.
    *
    * @param {mat4} a   the source 4x4 matrix
    * @returns {mat3} out
    */
    // public fromMat4(a: mat4): Float32Array {
    //     this[0] = a[0];
    //     this[1] = a[1];
    //     this[2] = a[2];
    //     this[3] = a[4];
    //     this[4] = a[5];
    //     this[5] = a[6];
    //     this[6] = a[8];
    //     this[7] = a[9];
    //     this[8] = a[10];
    //     return this;
    // }

    // public normalFromMat4(a: mat4) {
    //     const a00 = a[0]; const a01 = a[1]; const a02 = a[2]; const a03 = a[3];
    //     const a10 = a[4]; const a11 = a[5]; const a12 = a[6]; const a13 = a[7];
    //     const a20 = a[8]; const a21 = a[9]; const a22 = a[10]; const a23 = a[11];
    //     const a30 = a[12]; const a31 = a[13]; const a32 = a[14]; const a33 = a[15];

    //     const b00 = a00 * a11 - a01 * a10;
    //     const b01 = a00 * a12 - a02 * a10;
    //     const b02 = a00 * a13 - a03 * a10;
    //     const b03 = a01 * a12 - a02 * a11;
    //     const b04 = a01 * a13 - a03 * a11;
    //     const b05 = a02 * a13 - a03 * a12;
    //     const b06 = a20 * a31 - a21 * a30;
    //     const b07 = a20 * a32 - a22 * a30;
    //     const b08 = a20 * a33 - a23 * a30;
    //     const b09 = a21 * a32 - a22 * a31;
    //     const b10 = a21 * a33 - a23 * a31;
    //     const b11 = a22 * a33 - a23 * a32;

    //     // Calculate the determinant
    //     let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    //     if (!det) {
    //         return null;
    //     }
    //     det = 1.0 / det;

    //     this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    //     this[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    //     this[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    //     this[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    //     this[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    //     this[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    //     this[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    //     this[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    //     this[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    //     return this;
    // }

    public static transformVector(n: Float32Array, t: Float32Array, i: Float32Array) {
        n[0] = t[0] * i[0] + t[3] * i[1] + t[6] * i[2];
        n[1] = t[1] * i[0] + t[4] * i[1] + t[7] * i[2];
        n[2] = t[2] * i[0] + t[5] * i[1] + t[8] * i[2];
        return n;
    }

    public static invert(n: Float32Array, t: Float32Array) {
        const r = t[0];
        const u = t[1];
        const f = t[2];
        const e = t[3];
        const o = t[4];
        const s = t[5];
        const h = t[6];
        const c = t[7];
        const l = t[8];
        const a = l * o - s * c;
        const v = -l * e + s * h;
        const y = c * e - o * h;
        let i = r * a + u * v + f * y;
        return i ? (i = 1 / i, n[0] = a * i, n[1] = (-l * u + f * c) * i, n[2] = (s * u - f * o) * i, n[3] = v * i, n[4] = (l * r - f * h) * i, n[5] = (-s * r + f * e) * i, n[6] = y * i, n[7] = (-c * r + u * h) * i, n[8] = (o * r - u * e) * i, n) : null;
    }

    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.rotate(dest, dest, rad);
     *
     * @param {Number} rad the angle to rotate the matrix by
     */
    public fromRotation(rad: number) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);

        this[0] = c;
        this[1] = s;
        this[2] = 0;

        this[3] = -s;
        this[4] = c;
        this[5] = 0;

        this[6] = 0;
        this[7] = 0;
        this[8] = 1;
        return this;
    }

    public static rotationMatrix(rad :number) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        var matrix = new mat3();
        matrix[0] = cos;
        matrix[1] = -sin;
        matrix[3] = sin;
        matrix[4] = cos;

        return matrix;
    }

    /**
     * Multiplies two mat3's
     *
     * @param {ReadonlyMat3} b the second operand
     */
    public multiply(b: mat3): mat3 {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        const a20 = this[6];
        const a21 = this[7];
        const a22 = this[8];

        const b00 = b[0];
        const b01 = b[1];
        const b02 = b[2];
        const b10 = b[3];
        const b11 = b[4];
        const b12 = b[5];
        const b20 = b[6];
        const b21 = b[7];
        const b22 = b[8];

        this[0] = b00 * a00 + b01 * a10 + b02 * a20;
        this[1] = b00 * a01 + b01 * a11 + b02 * a21;
        this[2] = b00 * a02 + b01 * a12 + b02 * a22;

        this[3] = b10 * a00 + b11 * a10 + b12 * a20;
        this[4] = b10 * a01 + b11 * a11 + b12 * a21;
        this[5] = b10 * a02 + b11 * a12 + b12 * a22;

        this[6] = b20 * a00 + b21 * a10 + b22 * a20;
        this[7] = b20 * a01 + b21 * a11 + b22 * a21;
        this[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return this;
    }

    public static translationMatrix(x: number, y: number, scaleX=1, scaleY=1): mat3 {
        var matrix = new mat3();
        matrix[6] = x * scaleX;
        matrix[7] = y * scaleY;
        
        return matrix;
    }

    public static scalingMatrix(x: number, y: number): mat3 {
        var matrix = new mat3();
        matrix[0] = x;
        matrix[4] = y;

        return matrix;
    }
}
