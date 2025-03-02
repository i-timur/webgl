import {Injectable} from '@angular/core';
import {ShaderUtil} from '../utils/shader-util';
import vertexShader from '../shaders/vertex-shader.glsl';
import fragmentShader from '../shaders/fragment-shader.glsl';

export interface WebGlContext extends WebGL2RenderingContext {
  fClear: () => WebGlContext;
  fSetSize: (w: number, h: number) => WebGlContext;
  fCreateArrayBuffer: (array: Float32Array<ArrayBuffer>, isStatic?: boolean) => WebGLBuffer;
}

@Injectable()
export class WebglRendererService {
  public renderLoopParams = {
    gVertCount: 0,
    uAngle: 0,
    gPointSize: 0,
    gPointSizeStep: 3,
    gAngle: 0,
    gAngleStep: Math.PI / 180 * 90,
  };

  public uPointSizeLoc: WebGLUniformLocation | null = null;

  public uAngleLoc: WebGLUniformLocation | null = null;

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

    const prog = ShaderUtil.shaderProgram(gl, vertexShader, fragmentShader);
    if (!prog) {
      throw Error('Something went wrong');
    }

    gl.useProgram(prog);
    const aPosLoc = gl.getAttribLocation(prog, 'a_position');
    this.uAngleLoc = gl.getUniformLocation(prog, 'uAngle');
    this.uPointSizeLoc = gl.getUniformLocation(prog, 'uPointSize');
    gl.useProgram(null);

    const arrVertices = new Float32Array([0, 0, 0]);
    const buffVertices = gl.fCreateArrayBuffer(arrVertices);
    this.renderLoopParams.gVertCount = arrVertices.length / 3;

    gl.useProgram(prog); // activate the shader.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffVertices);
    gl.enableVertexAttribArray(aPosLoc); // enable the position attribute in the shader.
    gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0); // set which buffer the attribute will pull its data from.
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
