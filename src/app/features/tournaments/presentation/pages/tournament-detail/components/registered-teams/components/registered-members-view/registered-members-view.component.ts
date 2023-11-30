import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MemberDescriptionType, MemberEntity } from '@deporty-org/entities';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import AppState from 'src/app/app.state';
import { GetUsersByIdsCommand } from 'src/app/features/users/state-management/users.commands';
import { selectUsersById } from 'src/app/features/users/state-management/users.selector';

@Component({
  selector: 'app-registered-members-view',

  styleUrls: ['./registered-members-view.component.scss'],
  templateUrl: './registered-members-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisteredMembersViewComponent implements OnInit, OnDestroy {
  members?: Array<MemberEntity>;
  fullMembers?: Array<MemberDescriptionType>;
  suscription?: Subscription;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<RegisteredMembersViewComponent>,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }
  ngOnInit(): void {
    this.members = this.data.members;
    if (this.members) {
      const ids = this.members.map((member) => member.userId);
      this.store.dispatch(
        GetUsersByIdsCommand({
          ids,
        })
      );

      this.suscription = this.store
        .select(selectUsersById(ids))
        .subscribe((users) => {
          console.log(users);
          console.log(this.members);
          this.fullMembers = [];
          for (const user of users) {
            if (user) {
              const v = this.members?.find(
                (member) => member.userId === user.id
              );

              this.fullMembers?.push({
                member: v!,
                user,
              });
            }
          }
          this.cd.detectChanges();
        });
    }
  }
}
