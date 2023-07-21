import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPlayerModel } from '@deporty-org/entities/players';
import { DEFAULT_PROFILE_IMG } from 'src/app/app.constants';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent implements OnInit, OnChanges {
  @Input() player!: Partial<IPlayerModel>;
  @Input() number!: number | undefined | null;
  @Input() actions: any[];
  @Output() onSelectedPlayer;
  defaultImg: string;
  img!: string;

  constructor(@Inject(MAT_DIALOG_DATA) @Optional() public data: IPlayerModel) {
    this.defaultImg = DEFAULT_PROFILE_IMG;
    this.onSelectedPlayer = new EventEmitter();
    this.actions = [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  click() {
    this.onSelectedPlayer.emit();
  }
  update() {
    if (this.data && !this.player) {
      this.player = this.data;
    }
  }

  ngOnInit(): void {
    this.update();
  }
}
