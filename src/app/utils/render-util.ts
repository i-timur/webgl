import {WebglRendererService} from '../services/webgl-renderer.service';

export function render(webglRenderer: WebglRendererService, dt: number): void {
  const {gl, renderLoopParams} = webglRenderer;

  gl?.fClear();

  const {gShader, gModel, gPointSizeStep, gAngleStep} = renderLoopParams;
  renderLoopParams.gPointSize += gPointSizeStep * dt;
  renderLoopParams.gAngle += gAngleStep * dt;
  gShader?.activate().render(gModel);
}
