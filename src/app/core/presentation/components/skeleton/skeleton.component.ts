import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent implements OnInit {
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() kind: 'circle' | 'square' = 'square';

  constructor(private elementRef: ElementRef) {}

  setSize() {
    const element: HTMLElement = this.elementRef.nativeElement as HTMLElement;
    element.style.width = this.width;
    if (this.height == 'ew') {
      const w = element.clientWidth;
      element.style.height = w + 'px';
    } else {
      element.style.height = this.height;
    }
    element.classList.add(this.kind);
  }
  ngOnInit(): void {
    this.setSize();
  }
}
