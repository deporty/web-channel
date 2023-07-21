import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IntergroupMatchEntity } from '@deporty-org/entities/tournaments';
import { Store } from '@ngrx/store';
import AppState from 'src/app/app.state';
import { RESOURCES_PERMISSIONS_IT } from 'src/app/init-app';

@Component({
  selector: 'app-edit-intergroup-match',
  templateUrl: './edit-intergroup-match.component.html',
  styleUrls: ['./edit-intergroup-match.component.scss'],
})
export class AddIntergroupMatchComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  match!: IntergroupMatchEntity;
  meta!: any;
  stageId!: string;
  tournamentId!: string;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    private store: Store<AppState>
  ) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {}

  saveData(data: any) {}
}
