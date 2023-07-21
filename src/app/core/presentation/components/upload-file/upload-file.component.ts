import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

export type FileFormat = 'jpg' | 'jpeg' | 'png';

const formatMapper: any = {
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, AfterViewInit {
  @Input() text = 'Subir archivo';
  @Input('show-file') showFile = true;
  @Input('available-formats') availableFormats!: FileFormat[];

  @ViewChild('inputFile', { read: ElementRef })
  uploadComponent!: ElementRef<HTMLDivElement>;

  @Output() onSelectedFile: EventEmitter<any>;

  nameFile!: string;
  file!: File;
  error!: string;

  getDisplayFormats() {
    return this.availableFormats.join(', ');
  }
  constructor() {
    this.onSelectedFile = new EventEmitter();
  }

  ngOnInit(): void {}

  uploadFile() {}

  ngAfterViewInit(): void {
    this.addListener();
  }

  searchMime(mime: string): string | undefined {
    for (const format in formatMapper) {
      const value = formatMapper[format];
      if (value == mime) {
        return format;
      }
    }
  }
  addListener() {
    const inputElement: HTMLInputElement = this.uploadComponent
      .nativeElement as HTMLInputElement;

    inputElement.onchange = (event) => {
      event.preventDefault();
      this.error = '';
      var fileList: FileList | null = inputElement.files;
      if (fileList) {
        for (const key in fileList) {
          if (Object.prototype.hasOwnProperty.call(fileList, key)) {
            const file = fileList[key];

            const mimeType = file.type;
            let isValid = true;
            if (this.availableFormats) {
              const mime = this.searchMime(mimeType);

              isValid = !!mime;
              if (!!mime) {
                isValid = this.availableFormats.includes(mime as FileFormat);
              }
            }

            if (isValid) {
              var reader = new FileReader();
              reader.onload = (e: any) => {
                this.onSelectedFile.emit({ file: file, url: e.target.result });
              };
              reader.readAsDataURL(file);

              this.file = file;
              this.nameFile = file.name;
            } else {
              this.error = 'Formato no válido.';
              setTimeout(() => {
                this.error = '';
              }, 3000);
            }
          }
        }
      }
    };
  }
}
