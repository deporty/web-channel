import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { AdDirective } from '../ad.directive';
import { COMPONENTS_MAPPER } from '../components.mapper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageComponent } from '../image/image.component';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailComponent implements OnInit {
  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;
  body: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<NewsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.body = this.data;
    this.render(this.body.body, this.adHost);
  }

  render(body: any, parent: AdDirective): void {
    let newParent = parent;
    if (body.component) {
      const component = (COMPONENTS_MAPPER as any)[body.component];

      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(component);
      // this.viewContainerRef.clear();
      const componentRef =
        parent.viewContainerRef.createComponent(componentFactory);
      newParent = (componentRef.instance as any).adHost;
      (<any>componentRef.instance).data = body.data;
      if (body.layout) {
        (<any>componentRef.instance).elementRef?.nativeElement.classList.add(
          ...body.layout
        );
      }
    }
    if (body.children) {
      for (const child of body.children) {
        this.render(child, newParent);
      }
    }
  }
}
