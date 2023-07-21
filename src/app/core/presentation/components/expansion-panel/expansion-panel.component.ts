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
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
})
export class ExpansionPanelComponent implements OnInit, AfterViewInit {
  icon = 'keyboard_arrow_down';

  @Output('on-change') onChange: EventEmitter<boolean>;
  @Input() checked: boolean = false;
  opened = false;
  @ViewChild('expansionPanelBody', { static: true }) body!: ElementRef;
  @ViewChild(MatCheckbox, { static: true }) checkbox!: MatCheckbox;
  constructor() {
    this.onChange = new EventEmitter();
  }
  ngAfterViewInit(): void {
    this.checkbox.checked = this.checked;
  }

  ngOnInit(): void {}
  change(event: MatCheckboxChange) {
    this.onChange.emit(event.checked);
  }

  toggle() {
    this.opened = !this.opened;
    this.icon = !this.opened ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
    this.setClass();
  }
  setClass() {
    this.body.nativeElement.classList.toggle('expansion-panel-body-active');
  }
}
