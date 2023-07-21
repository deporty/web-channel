import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss']
})
export class ParagraphComponent implements OnInit {

  data: any;

  maxHeight = 300;
  
  constructor() { }

  ngOnInit(): void {
  }

}
