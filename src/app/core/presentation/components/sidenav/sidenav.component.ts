import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { GeneralAction } from 'src/app/core/interfaces/general-action';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit {
  @Input() options!: Array<GeneralAction>;
  @Input() icon!: string;
  @Input() mode: 'side' | 'over';

  @ViewChild(MatDrawer) matDrawer!: MatDrawer;

  showTriggerButton: boolean;
  constructor() {
    this.mode = 'over';
    this.icon = 'dataset';
    this.showTriggerButton = true;
  }
  ngAfterViewInit(): void {
    this.matDrawer.openedChange.subscribe((status: boolean) => {
      this.showTriggerButton = !status;
    });
  }

  ngOnInit(): void {}

  togleMenu() {
    this.showTriggerButton = !this.showTriggerButton;
    if (this.matDrawer) {
      this.matDrawer.toggle();
    }
  }
  execute(handler: Function) {
    this.matDrawer.toggle();
    handler();
  }
}
