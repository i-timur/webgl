import {Shader} from './shader';
import {WebGlContext} from '../../types/webgl-renderer.service';
import vertexShader from '../shaders/vertex-shader.glsl';
import fragmentShader from '../shaders/fragment-shader.glsl';

export class TextShader extends Shader {
  constructor(gl: WebGlContext) {
    super(gl, vertexShader, fragmentShader);

    this.uniformLoc.uPointSize = this.gl.getUniformLocation(this.program, 'uPointSize')
    this.uniformLoc.uAngle = this.gl.getUniformLocation(this.program, 'uAngle');

    gl.useProgram(null);
  }

  public set(size: number, angel: number) {
    const {uPointSize, uAngle} = this.uniformLoc;
    this.gl.uniform1f(uPointSize, size);
    this.gl.uniform1f(uAngle, angel);
    return this;
  }
}
