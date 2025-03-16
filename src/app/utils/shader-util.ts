import {
  ATTR_NORMAL_LOC,
  ATTR_NORMAL_NAME,
  ATTR_POSITION_LOC,
  ATTR_POSITION_NAME,
  ATTR_UV_LOC,
  ATTR_UV_NAME
} from '../constants/webgl-renderer.constants';
import {WebGlContext} from '../../types/webgl-renderer.service';
import {AttribLoc} from '../../types/shader-util';

export class ShaderUtil {
  static createShader(gl: WebGlContext, src: string, type: GLenum): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error('Could not create shader');
    }
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader: ', gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  public static createProgram(gl: WebGlContext, vShader: WebGLShader, fShader: WebGLShader, doValidate = false) {
    const prog = gl.createProgram();
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    // Force predefined locations for specific attributes. If the attribute isn't used in the shader its location will default to -1.
    gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
    gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
    gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      throw Error(`'Error creating shader program: , ${gl.getProgramInfoLog(prog)}`);
    }

    if (doValidate) {
      gl.validateProgram(prog);
      if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        gl.deleteProgram(prog);
        throw Error(`'Error creating shader program: , ${gl.getProgramInfoLog(prog)}`);
      }
    }

    gl.detachShader(prog, vShader);
    gl.detachShader(prog, fShader);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);
    return prog;
  }

  public static shaderProgram(gl: WebGlContext, vShaderSrc: string, fShaderSrc: string, doValidate = true) {
    const vShader = ShaderUtil.createShader(gl, vShaderSrc, gl.VERTEX_SHADER);
    const fShader = ShaderUtil.createShader(gl, fShaderSrc, gl.FRAGMENT_SHADER);

    if (!vShader || !fShader) {
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      throw Error('Something went wrong');
    }

    return ShaderUtil.createProgram(gl, vShader, fShader, doValidate);
  }

  public static getStandardAttribLocations(gl: WebGL2RenderingContext, program: WebGLProgram): AttribLoc {
    return {
      position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
      norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
      uv: gl.getAttribLocation(program, ATTR_UV_NAME),
    }
  }
}
