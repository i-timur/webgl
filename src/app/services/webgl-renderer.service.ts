import {Injectable} from '@angular/core';
import {
  ATTR_NORMAL_LOC,
  ATTR_POSITION_LOC,
  ATTR_UV_LOC
} from '../constants/webgl-renderer.constants';
import {MeshVAO, Params, WebGlContext} from '../../types/webgl-renderer.service';
import {TextShader} from '../models/text-shader';
import {Model} from '../models/model';
import {TestShader} from '../models/test-shader';
import {GridAxis} from '../models/grid-axis';

@Injectable()
export class WebglRendererService {
  public renderLoopParams: Params = {
    gVertCount: 0,
    uAngle: 0,
    gPointSize: 0,
    gPointSizeStep: 3,
    gAngle: 0,
    gAngleStep: Math.PI / 180 * 90,
    gShader: null,
    gModel: null,
  };

  public gl?: WebGlContext;

  private glInstance(canvas: HTMLCanvasElement): WebGlContext {
    if (!canvas) {
      throw new Error('Canvas is not available');
    }

    const gl = canvas.getContext('webgl2') as WebGlContext;
    if (!gl) {
      throw new Error('Context is not available');
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.fClear = function () {
      this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
      return this;
    }
    gl.fSetSize = function (w, h) {
      (this.canvas as HTMLCanvasElement).style.width = w + 'px';
      (this.canvas as HTMLCanvasElement).style.height = h + 'px';
      this.canvas.width = w;
      this.canvas.height = h;

      this.viewport(0, 0, w, h);
      return this;
    }
    gl.fCreateArrayBuffer = function (array, isStatic = true) {
      const buff = this.createBuffer();
      this.bindBuffer(this.ARRAY_BUFFER, buff);
      this.bufferData(this.ARRAY_BUFFER, array, isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
      this.bindBuffer(this.ARRAY_BUFFER, null);
      return buff;
    }

    gl.mMeshCache = {};

    // Turns arrays into GL buffers, then setup a VAO that will predefine the buffers to standard shader attributes.
    gl.fCreateMeshVAO = function (name: string, arrVert: number[] | null, arrIdx?: number[] | null, arrNorm?: number[] | null, arrUV?: number[] | null) {
      let rtn: MeshVAO = {
        drawMode: this.TRIANGLES,
        vao: null,
        buffVertices: null,
        vertexComponentLen: -1,
        vertexCount: -1,
        buffNormals: null,
        buffUV: null,
        buffIndex: null,
        indexCount: -1,
      };

      // create and bind vao.
      rtn.vao = this.createVertexArray();
      this.bindVertexArray(rtn.vao); // bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

      if (arrVert) {
        rtn.buffVertices = this.createBuffer();
        rtn.vertexComponentLen = 3;
        rtn.vertexCount = arrVert.length / rtn.vertexComponentLen;

        this.bindBuffer(this.ARRAY_BUFFER, rtn.buffVertices);
        this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrVert), this.STATIC_DRAW);
        this.enableVertexAttribArray(ATTR_POSITION_LOC);
        this.vertexAttribPointer(ATTR_POSITION_LOC, 3, this.FLOAT, false, 0, 0);
      }

      if (arrNorm) {
        rtn.buffNormals = this.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, rtn.buffNormals);
        this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrNorm), this.STATIC_DRAW);
        this.enableVertexAttribArray(ATTR_NORMAL_LOC);
        this.vertexAttribPointer(ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
      }

      if (arrUV) {
        rtn.buffUV = this.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, rtn.buffUV);
        this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrUV), this.STATIC_DRAW);
        this.enableVertexAttribArray(ATTR_UV_LOC);
        this.vertexAttribPointer(ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);
      }

      if (arrIdx) {
        rtn.buffIndex = this.createBuffer();
        rtn.indexCount = arrIdx.length;
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.buffIndex);
        this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrIdx), this.STATIC_DRAW);
        this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
      }

      this.bindVertexArray(null);
      this.bindBuffer(this.ARRAY_BUFFER, null);

      this.mMeshCache[name] = rtn;

      return rtn;
    }

    return gl;
  }

  public initGlInstance(canvas: HTMLCanvasElement) {
    this.gl = this.glInstance(canvas).fSetSize(500, 500).fClear();
  }

  public runProgram() {
    const gl = this.gl;
    if (!gl) {
      throw new Error('Webgl instance has not been initialized.');
    }

    this.renderLoopParams.gShader = new TestShader(gl, [0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]) // Gray, Red, Green, Blue
    // const mesh = gl.fCreateMeshVAO('lines', [0, 1, 0, 0, -1, 0, -1, 0, 0, 1, 0, 0]);
    // mesh.drawMode = gl.LINES
    this.renderLoopParams.gModel = new Model(GridAxis.createMesh(gl));
  }
}
