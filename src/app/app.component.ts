import {AfterViewInit, Component, ElementRef, inject, viewChild} from '@angular/core';
import {RENDER_LOOP_PARAMS_TOKEN} from './tokens/render-loop.tokens';
import {WebglRendererService} from './services/webgl-renderer.service';
import {RenderLoopService} from './services/render-loop.service';
import {render} from './utils/render-util';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    WebglRendererService,
    RenderLoopService,
    {
      provide: RENDER_LOOP_PARAMS_TOKEN,
      useValue: {
        callback: render,
      }
    }
  ]
})
export class AppComponent implements AfterViewInit {
  private readonly webGlRenderer = inject(WebglRendererService);

  private readonly renderLoop = inject(RenderLoopService);

  private readonly canvas = viewChild('webgl', {read: ElementRef});

  ngAfterViewInit(): void {
    this.initWebGl2();
  }

  private initWebGl2(): void {
    const canvas = this.canvas();
    if (canvas) {
      this.webGlRenderer.initGlInstance(canvas.nativeElement);
      this.webGlRenderer.runProgram();
      this.renderLoop.start();
    } else {
      console.error('Canvas element was not found.');
    }
  }
}
