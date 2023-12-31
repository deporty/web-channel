import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AdDirective } from '../ad.directive';

@Component({
  selector: 'app-col',
  templateUrl: './col.component.html',
  styleUrls: ['./col.component.scss'],
})
export class ColComponent implements OnInit {
  data!: { [x: string]: any };
  constructor(
    public viewContainerRef: ViewContainerRef,
    public elementRef: ElementRef

  ) {}
  @ViewChild(AdDirective, { static: true }) public adHost!: AdDirective;

  ngOnInit(): void {
    // this.updateLayout();
  }

  // updateLayout() {
  //   const temp = { ...this.data };

  //   const defaultValue = this.data ? this.data['def'] : null;
  //   delete temp['def'];

  //   let mapped = Object.entries(temp).map((item) => {
  //     return `col-${item[0]}-${item[1]}`;
  //   });

  //   if (defaultValue) {
  //     mapped.push(`col-${defaultValue}`);
  //   }
  //   (mapped as Array<string>).forEach((a) => {
  //     this.el.nativeElement.classList.add(a);
  //   });
  // }
}
