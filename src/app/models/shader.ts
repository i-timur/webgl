import {ShaderUtil} from '../utils/shader-util';
import {Model} from './model';
import {WebGlContext} from '../../types/webgl-renderer.service';
import {AttribLoc} from '../../types/shader-util';
import {UniformLocation} from '../../types/shader';

export abstract class Shader {
  program: WebGLProgram;
  attribLoc: AttribLoc;
  uniformLoc: UniformLocation;

  constructor(protected gl: WebGlContext, vertexShader: string, fragmentShader: string) {
    this.program = ShaderUtil.shaderProgram(gl, vertexShader, fragmentShader);
    this.gl.useProgram(this.program);
    this.attribLoc = ShaderUtil.getStandardAttribLocations(this.gl, this.program);
    this.uniformLoc = {uAngle: null, uPointSize: null};
  }

  public activate() {
    this.gl.useProgram(this.program);
    return this;
  }

  public deactivate() {
    this.gl.useProgram(null);
    return this;
  }

  public dispose() {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
      this.gl.useProgram(null);
    }

    this.gl.deleteProgram(this.program);
  }

  public prerender() {
  }

  render(model: Model | null) {
    if (!model) {
      return this;
    }

    const {vao, indexCount, drawMode, vertexCount} = model.mesh;
    this.gl.bindVertexArray(vao);

    if (indexCount > 0) {
      this.gl.drawElements(drawMode, indexCount, this.gl.UNSIGNED_SHORT, 0);
    } else {
      this.gl.drawArrays(drawMode, 0, vertexCount);
    }

    this.gl.bindVertexArray(null);

    return this;
  }
}
