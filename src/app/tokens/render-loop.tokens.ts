import {InjectionToken} from '@angular/core';
import {WebglRendererService} from '../services/webgl-renderer.service';

export interface RenderLoopParams {
  callback: (webglRenderer: WebglRendererService, delta: number) => void;
  fps?: number;
  limitFps?: boolean;
}

export const RENDER_LOOP_PARAMS_TOKEN = new InjectionToken<RenderLoopParams>('render loop params');
