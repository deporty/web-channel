import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Sanitizer,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pathToFileURL } from 'url';

@Component({
  selector: 'app-base64-modal',
  templateUrl: './base64-modal.component.html',
  styleUrls: ['./base64-modal.component.scss'],
})
export class Base64ModalComponent implements OnInit {
  @Input() base64!: string;

  @ViewChild('frame', { static: false }) frame!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.data) {
      this.base64 = this.data.base64;
      setTimeout(() => {
        this.render();
      }, 1000);
    }
  }

  render() {
    const file_header = ';headers=filename=';

    if (this.frame) {
      const FILE_NAME = 'VEGUETA';
      const data = this.base64.replace(
        ';',
        file_header + encodeURIComponent(FILE_NAME) + ';'
      );
      this.frame.nativeElement.setAttribute('src', data);
    }
  }
}
