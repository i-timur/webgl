import {Shader} from './shader';
import {WebGlContext} from '../../types/webgl-renderer.service';
import vertexShader from '../shaders/vertex-shader.glsl';
import fragmentShader from '../shaders/fragment-shader.glsl';

export class TestShader extends Shader {
  constructor(gl: WebGlContext, arrColor: number[]) {
    super(gl, vertexShader, fragmentShader);
    const uColor = gl.getUniformLocation(this.program, 'uColor');
    gl.uniform3fv(uColor, arrColor);
    gl.useProgram(null);
  }
}
