import {MeshVAO} from '../../types/webgl-renderer.service';

export class Model {
  mesh: MeshVAO

  constructor(mesh: MeshVAO) {
    this.mesh = mesh;
  }

  public prerender() {

  }
}
