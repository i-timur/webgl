import {Model} from '../app/models/model';
import {TextShader} from '../app/models/text-shader';

export interface MeshVAO {
  drawMode: number;
  vao: WebGLVertexArrayObject | null;
  buffVertices: WebGLBuffer | null;
  vertexComponentLen: number;
  vertexCount: number;
  buffNormals: WebGLBuffer | null;
  buffUV: WebGLBuffer | null;
  buffIndex: WebGLBuffer | null;
  indexCount: number;
}

export interface WebGlContext extends WebGL2RenderingContext {
  fClear: () => WebGlContext;
  fSetSize: (w: number, h: number) => WebGlContext;
  fCreateArrayBuffer: (array: Float32Array<ArrayBuffer>, isStatic?: boolean) => WebGLBuffer;
  mMeshCache: Record<string, MeshVAO>;
  fCreateMeshVAO: (name: string, arrIdx: number[] | null, arrVert: number[] | null, arrNorm: number[] | null, arrUV: number[] | null) => MeshVAO;
}

export interface Params {
  gVertCount: number,
  uAngle: number,
  gPointSize: number,
  gPointSizeStep: number,
  gAngle: number,
  gAngleStep: number,
  gShader: TextShader | null;
  gModel: Model | null;
}
