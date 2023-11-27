import {
  Component,
  OnInit,
  ViewContainerRef,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.scss'],
})
export class PadComponent implements OnInit, AfterViewInit, OnChanges {
  canvas!: HTMLCanvasElement;
  @ViewChild('canvas') canvasRef!: ElementRef;
  @ViewChild('cover', { static: false }) container!: ElementRef;
  edited: boolean;
  prev!: string;
  @Input() preview!: string;
  @ViewChild('previewImg', { static: false }) previewImg!: ElementRef;
  signaturePad!: SignaturePad;
  showCanvas: boolean;
  @Input() title!: string;

  originalWidth: number;
  originalHeight: number;

  constructor(private er: ElementRef, private vcr: ViewContainerRef) {
    this.showCanvas = false;
    this.edited = false;
    this.originalHeight = 0;
    this.originalWidth = 0;
  }

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  async getImage() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signature = this.signaturePad.toDataURL('image/jpg');

      return Promise.resolve(signature);
    } else {
      return Promise.resolve(this.preview);
    }
  }

  ngAfterViewInit(): void {
    const func = () => {
      const dimensions = this.er.nativeElement.getBoundingClientRect();
      if (dimensions.width != 0 && dimensions.width != this.originalWidth) {
        this.originalWidth = dimensions.width;

        this.resizeCanvas();
      }

      requestAnimationFrame(func);
    };
    requestAnimationFrame(func);
    setTimeout(() => {
      this.updateCanvas();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

  setState() {
    this.showCanvas = !this.showCanvas;
    if (!this.edited) {
      this.edited = true;
    }
    setTimeout(() => {
      this.updateCanvas();
    }, 200);
  }

  resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    if (this.container) {
      const container: HTMLDivElement = this.container.nativeElement;
      const temp = this.canvas.toDataURL();
      this.canvas.width = container.getBoundingClientRect().width * ratio;
      this.canvas.height = container.getBoundingClientRect().width * ratio;
      this.canvas.getContext('2d')?.scale(ratio, ratio);
      if (this.signaturePad) {
        this.signaturePad.fromDataURL(temp);
      }
    }
  }

  private updateCanvas() {

    if (this.container) {
      this.canvas = this.canvasRef.nativeElement;

      this.resizeCanvas();
      this.signaturePad = new SignaturePad(this.canvas, {
        dotSize:1
      });
      
    }
  }
}
