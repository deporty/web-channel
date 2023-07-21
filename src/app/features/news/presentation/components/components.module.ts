import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { HeaderComponent } from './header/header.component';
import { AdDirective } from './ad.directive';
import { AdComponent } from './ad/ad.component';
import { NewsComponent } from './news/news.component';
import { RowComponent } from './row/row.component';
import { ColComponent } from './col/col.component';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { FullNewsComponent } from './full-news/full-news.component';
import { NewPreviewComponent } from './new-preview/new-preview.component';

const COMPONENTS = [
  ParagraphComponent,
  AdDirective,
  AdComponent,
  NewsComponent,
  RowComponent,
  ColComponent,
  AudioComponent,
  VideoComponent,
  FullNewsComponent,
  NewPreviewComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
