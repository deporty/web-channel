import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AdDirective } from '../ad.directive';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent implements OnInit {
  data: any;

  maxHeight = 300;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public elementRef: ElementRef
  ) {}

  @ViewChild(AdDirective, { static: true }) public adHost!: AdDirective;

  ngOnInit(): void {}
}
