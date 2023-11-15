import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewsDetailComponent } from '../news-detail/news-detail.component';

@Component({
  selector: 'app-new-preview',
  templateUrl: './new-preview.component.html',
  styleUrls: ['./new-preview.component.scss'],
})
export class NewPreviewComponent implements OnInit {
  data: any;
  @Input() new: any;
  @Input('show-abstract') showAbstract = true;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.data = this.new;
  }
  open() {
    this.dialog.open(NewsDetailComponent,{
      data: this.data,
      height: '80vh'
    });
  }
}
