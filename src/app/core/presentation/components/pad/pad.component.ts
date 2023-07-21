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
  @ViewChild('canvas') canvasRef!: ElementRef;
  @ViewChild('cover', { static: false }) container!: ElementRef;
  @ViewChild('previewImg', { static: false }) previewImg!: ElementRef;

  @Input() title!: string;
  @Input() preview!: string;
  signaturePad!: SignaturePad;
  canvas: any;
  prev!: string;
  state: boolean;
  edited: boolean;
  constructor() {
    this.state = false;
    this.edited = false;
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  setState() {
    this.state = !this.state;
    if (!this.edited) {
      this.edited = true;
    }
    setTimeout(() => {
      this.updateCanvas();
    }, 200);
  }
  ngAfterViewInit(): void {
    this.updateCanvas();
  }

  private updateCanvas() {
    if (this.container) {
      const container: HTMLDivElement = this.container.nativeElement;

      this.canvas = this.canvasRef.nativeElement;
      this.canvas.width = container.getBoundingClientRect().width;
      this.signaturePad = new SignaturePad(this.canvas);

      window.onresize = this.resizeCanvas;
      this.resizeCanvas();
    }
  }

  resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);

    this.canvas.width = this.canvas.offsetWidth * ratio;
    this.canvas.height = this.canvas.offsetHeight * ratio * 2;
    this.canvas.getContext('2d').scale(ratio, ratio);

    this.signaturePad.clear();
  }

  ngOnInit(): void {}

  async getImage() {
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      const signature = this.signaturePad.toDataURL('image/jpg');
      console.log(signature);
      
      return Promise.resolve(signature);
    } else {
      return Promise.resolve(this.preview);
    }
  }

  clear() {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }
}
