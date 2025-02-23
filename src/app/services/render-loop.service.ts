import {inject, Injectable} from '@angular/core';
import {RENDER_LOOP_PARAMS_TOKEN} from '../tokens/render-loop.tokens';
import {WebglRendererService} from './webgl-renderer.service';
import {DOCUMENT} from '@angular/common';
import Stats, {Panel} from 'stats.js';

@Injectable()
export class RenderLoopService {
  private readonly params = inject(RENDER_LOOP_PARAMS_TOKEN);

  private readonly webglRenderer = inject(WebglRendererService);

  private readonly document = inject(DOCUMENT);

  private readonly stats = new Stats();

  private readonly panelIdx = 3;

  private lastFrame = 0;

  private isActive = false;

  private fps = 0;

  private maxFps = 0;

  private run!: () => void;

  public webglFpsPanel: Panel | null = null;

  constructor() {
    this.initStats();

    const {fps, callback, limitFps} = this.params;

    if (limitFps && fps && fps > 0) {
      const msFpsLimit = 1000 / fps;
      this.run = () => {
        const currentTime = window.performance.now();
        const msDelta = currentTime - this.lastFrame;
        const secDelta = Math.max(msDelta / 1000.0, 1e-6);

        if (msDelta > msFpsLimit) {
          this.fps = Math.floor(1 / secDelta);
          this.maxFps = Math.max(this.fps, this.maxFps);
          this.lastFrame = currentTime;
          callback(this.webglRenderer, secDelta);
        }

        if (this.isActive) {
          this.document.defaultView?.window.requestAnimationFrame(this.run.bind(this));
        }

        if (this.webglFpsPanel) {
          this.webglFpsPanel.update(this.fps, this.maxFps);
        }
      };
    } else {
      this.run = () => {
        const currentTime = window.performance.now();
        const msDelta = currentTime - this.lastFrame;
        const secDelta = Math.max(msDelta / 1000.0, 1e-6);

        this.fps = Math.floor(1 / secDelta);
        this.maxFps = Math.max(this.fps, this.maxFps);
        this.lastFrame = currentTime;
        callback(this.webglRenderer, secDelta);

        if (this.isActive) {
          this.document.defaultView?.window.requestAnimationFrame(this.run.bind(this));
        }

        if (this.webglFpsPanel) {
          this.webglFpsPanel.update(this.fps, this.maxFps);
        }
      };
    }
  }

  start() {
    this.isActive = true;
    this.lastFrame = performance.now();
    this.document.defaultView?.window.requestAnimationFrame(this.run.bind(this));
  }

  stop() {
    this.isActive = false;
    this.stats.dom.remove();
    this.webglFpsPanel = null;
  }

  private initStats(): void {
    this.webglFpsPanel = new Panel('webglFps', '#00ffff', '#000022');
    this.stats.addPanel(this.webglFpsPanel);
    this.stats.showPanel(this.panelIdx);
    this.stats.showPanel(this.panelIdx); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.document.body.appendChild(this.stats.dom);
  }
}
