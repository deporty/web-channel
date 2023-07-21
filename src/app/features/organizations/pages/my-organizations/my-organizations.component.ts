import { Component, OnInit } from '@angular/core';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { app } from 'src/app/init-app';

import { selectMyOrganizations } from '../../organizations.selector';
import { DEFAULT_ORGANIZATION_IMG } from 'src/app/app.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationDetailComponent } from '../organization-detail/organization-detail.component';
import {
  GetMyOrganizationsCommand,
  SelectCurrentOrganizationCommand,
} from '../../organizations.commands';

@Component({
  selector: 'app-my-organizations',
  templateUrl: './my-organizations.component.html',
  styleUrls: ['./my-organizations.component.scss'],
})
export class MyOrganizationsComponent implements OnInit {
  user: any;
  constructor(
    private store: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  defaultOrganizationIso = DEFAULT_ORGANIZATION_IMG;
  $organizations!: Observable<Array<OrganizationEntity> | undefined>;

  ngOnInit(): void {
    this.$organizations = this.store.select(selectMyOrganizations);

    getAuth(app).onAuthStateChanged((i) => {
      this.user = i;
      let email = this.user.email;
      // email = 'estefania.cortes17@gmail.com';
      this.store.dispatch(
        GetMyOrganizationsCommand({
          email,
        })
      );
    });
  }

  go(id?: string) {
    if (id) {
      // this.store.dispatch(
      //   SelectCurrentOrganizationCommand({
      //     organizationId: id,
      //   })
      // );
      this.router.navigate([`${id}`], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
