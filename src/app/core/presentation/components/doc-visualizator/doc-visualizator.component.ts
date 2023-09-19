import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
export interface DocumentConfig {
  name?: string;
  url?: string;
  data?: string;
}

@Component({
  selector: 'app-doc-visualizator',
  templateUrl: './doc-visualizator.component.html',
  styleUrls: ['./doc-visualizator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocVisualizatorComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @Input() docs?: DocumentConfig | DocumentConfig[];
}
