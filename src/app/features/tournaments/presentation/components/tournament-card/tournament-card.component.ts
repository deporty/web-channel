import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TournamentLayoutEntity } from '@deporty-org/entities/organizations';
import { TournamentEntity } from '@deporty-org/entities/tournaments';
import {
  DEFAULT_TOURNAMENT_LAYOUT_IMG,
  TOURNAMENT_STATUS_CODES,
} from 'src/app/app.constants';
import { TournamentCardDetailsComponent } from './tournament-card-details/tournament-card-details.component';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss'],
})
export class TournamentCardComponent implements OnChanges, OnInit {
  @Input() tournament!: TournamentEntity;
  @Input('tournament-layout') tournamentLayout!: TournamentLayoutEntity;
  @Input('mobile-compatible') mobileCompatible = false;
  isSmall = false;
  @Output('on-click') onClick: EventEmitter<TournamentEntity>;

  img = DEFAULT_TOURNAMENT_LAYOUT_IMG;
  usingTournament = false;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    this.onClick = new EventEmitter();
  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((state) => {
        if (state.breakpoints[Breakpoints.XSmall]) {
          this.isSmall = true;
        } else if (state.breakpoints[Breakpoints.Small]) {
          this.isSmall = true;
        } else if (state.breakpoints[Breakpoints.Medium]) {
          this.isSmall = false;
        } else if (state.breakpoints[Breakpoints.Large]) {
          this.isSmall = false;
        } else if (state.breakpoints[Breakpoints.XLarge]) {
          this.isSmall = false;
        }
        this.cdr.detectChanges();
      });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(TournamentCardDetailsComponent, {
      panelClass: 'bottom-sheet-container-with-no-padding',
      data: {
        tournament: this.tournament,
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (
        !this.usingTournament &&
        changes.tournamentLayout &&
        changes.tournamentLayout.currentValue &&
        changes.tournamentLayout.currentValue.flayer
      ) {
        this.img = changes.tournamentLayout.currentValue.flayer;
      }
      if (
        changes.tournament &&
        changes.tournament.currentValue &&
        changes.tournament.currentValue.flayer
      ) {
        this.usingTournament = true;
        this.img = changes.tournament.currentValue.flayer;
      }
    }
  }
}
