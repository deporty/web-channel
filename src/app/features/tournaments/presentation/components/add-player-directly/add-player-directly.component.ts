import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { IPlayerModel } from '@deporty-org/entities/players';
import { Store } from '@ngrx/store';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import AppState from 'src/app/app.state';
import { selectPlayers } from '../../../state-management/tournaments/tournaments.selector';

@Component({
  selector: 'app-add-player-directly',
  templateUrl: './add-player-directly.component.html',
  styleUrls: ['./add-player-directly.component.scss'],
})
export class AddPlayerDirectlyComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  registerNewFlag = false;
  createFlag = false;

  $allPlayersSelect!: Observable<IPlayerModel[] | undefined>;
  $allPlayersSelectSubscription!: Subscription;

  filteredPlayers!: Array<IPlayerModel>;
  fullPlayers!: Array<IPlayerModel>;

  player!: IPlayerModel | null;

  @ViewChild('inputDoc', {
    static: false,
  })
  input!: ElementRef<HTMLInputElement>;

  constructor(private store: Store<AppState>) {}
  ngAfterViewInit(): void {}

  registerNewFlagChange() {
    this.registerNewFlag = !this.registerNewFlag;
    setTimeout(() => {
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          map((x: any) => x.target.value),
          debounceTime(300)
        )
        .subscribe((x) => {
          this.filter(x);
        });
    }, 300);
  }

  ngOnDestroy(): void {
    this.$allPlayersSelectSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.$allPlayersSelect = this.store.select(selectPlayers);
    this.$allPlayersSelect.subscribe((players: IPlayerModel[] | undefined) => {
      if (!!players) {
        this.fullPlayers = players;
        this.filteredPlayers = players;
      }
    });
  }

  selectPlayer(player: any) {
    const document = player.option.value;
    this.filter(document);
  }

  filter(document: string) {
    this.player = null;
    this.filteredPlayers = this.fullPlayers.filter((x) => {
      return x.document?.includes(document);
    });
    if (this.filteredPlayers && this.filteredPlayers.length > 0) {
      this.player = this.filteredPlayers[0];
    }
  }
}
