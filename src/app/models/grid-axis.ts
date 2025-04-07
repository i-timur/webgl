import {MeshVAO, WebGlContext} from '../../types/webgl-renderer.service';
import {ATTR_POSITION_LOC} from '../constants/webgl-renderer.constants';
import {verifyHostBindings} from '@angular/compiler';

export class GridAxis {
  static createMesh(gl: WebGlContext) {
    const vertices: number[] = [];
    const size = 1.8;
    const divideBy = 10.0;
    const step = size / divideBy;
    const halfSize = size / 2;

    let p: number;
    for (let i = 0; i <= divideBy; i++) {
      // Vertical line
      p = -halfSize + (i * step);
      vertices.push(p); // x1
      vertices.push(halfSize); // y1
      vertices.push(0); // z1
      vertices.push(0); // c1

      vertices.push(p); // x2
      vertices.push(-halfSize); // y2
      vertices.push(0); // z2
      vertices.push(1); // c2

      // Horizontal line
      p = halfSize - (i * step);
      vertices.push(-halfSize) // x1
      vertices.push(p); // y1
      vertices.push(0); // z1
      vertices.push(0); // c1

      vertices.push(halfSize) // x2
      vertices.push(p); // y2
      vertices.push(0); // z2
      vertices.push(1); // c2
    }


    const attrColorLocation = 4;
    const mesh: MeshVAO = {
      drawMode: gl.LINES,
      vao: gl.createVertexArray(),
      vertexComponentLen: 4,
      vertexCount: vertices.length / 4,
      buffIndex: null,
      buffUV: null,
      buffVertices: null,
      buffNormals: null,
      indexCount: -1,
    };
    const strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;
    gl.bindVertexArray(mesh.vao);
    mesh.buffVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(ATTR_POSITION_LOC);
    gl.enableVertexAttribArray(attrColorLocation);

    gl.vertexAttribPointer(
      ATTR_POSITION_LOC, // Attribute Location.
      3, // How big is the vector by number count.
      gl.FLOAT, // What type of number we passing in.
      false, // Does it need to be normalized?
      strideLen, // How big is a vertex chunk of data
      0, // Offset by how much.
    );

    gl.vertexAttribPointer(
      attrColorLocation, // shader has "in float a_color" as the second attr.
      1,
      gl.FLOAT,
      false,
      strideLen, // each vertex chunk is 4 floats long.
      Float32Array.BYTES_PER_ELEMENT * 3, // skip first 3 floats in our vertex chunk
    );

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.mMeshCache['grid'] = mesh;
    return mesh;
  }
}
