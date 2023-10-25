import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Id, UserEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { DEFAULT_PROFILE_IMG } from 'src/app/app.constants';
import AppState from 'src/app/app.state';
import { GetUserByIdCommand } from '../../state-management/users.commands';
import { selectUserById } from '../../state-management/users.selector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player-summary-card',
  templateUrl: './player-summary-card.component.html',
  styleUrls: ['./player-summary-card.component.scss'],
})
export class PlayerSummaryCardComponent implements OnInit, OnDestroy {
  @Input() player!: UserEntity;
  @Input('user-id') userId!: Id;
  @Input('member-img') memberImg!: string | undefined;
  img!: string;
  user!: UserEntity;

  userSubscription!: Subscription;

  constructor(private store: Store<AppState>) {}
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.player) {
      this.user = this.player;
      this.img = this.memberImg || this.user.image || DEFAULT_PROFILE_IMG;
    } else {
      this.store.dispatch(
        GetUserByIdCommand({
          id: this.userId,
        })
      );
      this.userSubscription = this.store
        .select(selectUserById(this.userId))
        .subscribe((user) => {
          if (user) {
            this.user = user;
            this.img = this.memberImg || this.user.image || DEFAULT_PROFILE_IMG;
          }
        });
    }
  }
}
