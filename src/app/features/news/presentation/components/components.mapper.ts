import { AdComponent } from './ad/ad.component';
import { AudioComponent } from './audio/audio.component';
import { ColComponent } from './col/col.component';
import { HeaderComponent } from './header/header.component';
import { ImageComponent } from './image/image.component';
import { NewsComponent } from './news/news.component';
import { ParagraphComponent } from './paragraph/paragraph.component';
import { RowComponent } from './row/row.component';
import { VideoComponent } from './video/video.component';

export const COMPONENTS_MAPPER = {
  'header': HeaderComponent,
  'image': ImageComponent,
  'paragraph': ParagraphComponent,
  'ad': AdComponent,
  'news': NewsComponent,
  'col': ColComponent,
  'row': RowComponent,
  'audio': AudioComponent,
  'video': VideoComponent,
};
