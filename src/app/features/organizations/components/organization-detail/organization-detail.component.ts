import { Component, OnInit } from '@angular/core';
import { OrganizationEntity } from '@deporty-org/entities/organizations';
import { Store } from '@ngrx/store';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { app } from 'src/app/init-app';
import { GetMyOrganizationsCommand } from '../../organizations.events';
import { selectMyCurrentOrganization } from '../../organizations.selector';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.scss'],
})
export class OrganizationDetailComponent implements OnInit {
  static route = 'detail';
  user: any;
  constructor(private store: Store<any>) {}
  $organization!: Observable<OrganizationEntity | undefined>;

  ngOnInit(): void {
    this.$organization = this.store.select(selectMyCurrentOrganization);

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

    // this.store.dispatch(
    //   GetMyOrganization({
    //     email: 'estefania.cortes17@gmail.com',
    //   })
    // );
  }
}
