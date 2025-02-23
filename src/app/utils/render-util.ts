import {WebglRendererService} from '../services/webgl-renderer.service';

export function render(webglRenderer: WebglRendererService, delta: number): void {
  let {gl, uPointSizeLoc, renderLoopParams, uAngleLoc} = webglRenderer;

  renderLoopParams.gPointSize += renderLoopParams.gPointSizeStep * delta;
  const pointSize = Math.sin(renderLoopParams.gPointSize) * 10 + 30;
  gl?.uniform1f(uPointSizeLoc, pointSize);

  renderLoopParams.gAngle += renderLoopParams.gAngleStep * delta;
  gl?.uniform1f(uAngleLoc, renderLoopParams.gAngle);
  gl?.fClear();
  gl?.drawArrays(gl?.POINTS, 0, renderLoopParams.gVertCount);
}
