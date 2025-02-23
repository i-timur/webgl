import {WebGlContext} from '../services/webgl-renderer.service';

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

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Error creating shader program: ', gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }

    if (doValidate) {
      gl.validateProgram(prog);
      if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
        console.error('Error validating program: ', gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
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
      throw Error('Something went wrong');
    }
    return ShaderUtil.createProgram(gl, vShader, fShader, doValidate);
  }
}
