import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { ActivationStart, NavigationEnd, Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { PathSegment } from './core/presentation/components/breadcrumb/breadcrumb.component';
import { AuthRoutingModule } from './features/auth/auth-routing.module';
import {
  RESOURCES_PERMISSIONS,
  RESOURCES_PERMISSIONS_IT,
  USER_INFORMATION,
  USER_INFORMATION_IT,
  app,
} from './init-app';
import { TranslateService } from '@ngx-translate/core';
import { hasPermission } from './core/helpers/permission.helper';
import { isLocationAllowed } from './core/helpers/log-events.helper';
import { DEFAULT_PROFILE_IMG } from './app.constants';
import { AuthorizationService } from './features/auth/infrastructure/services/authorization/authorization.service';
import { decodeJwt } from 'jose';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'sports-tournament';
  user!: any;
  breakpoint = 700;
  typeBySize = {
    side: (size: number) => {
      return size >= this.breakpoint;
    },
    over: (size: number) => {
      return size < this.breakpoint;
    },
  };
  mode: MatDrawerMode;
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  paths: PathSegment[];
  state: boolean;
  defaultImg: string;
  suscription: any;
  loadedPermissions: boolean;
  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    @Inject(USER_INFORMATION_IT) protected userInformation: any,
    private authorizationService: AuthorizationService
  ) {
    this.defaultImg = DEFAULT_PROFILE_IMG;
    this.mode = 'over';
    this.paths = [];
    this.state = false;
    this.loadedPermissions = false;
    console.log(this.user);

    translate.setDefaultLang('es');
    translate.use('es');
  }
  ngOnDestroy(): void {
    console.log("No deberia ejecutarse nunca");
    
    this.suscription?.unsubscribe();
  }

  isAllowedToViewOrganizations() {
    const identifier = 'view-organizations';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  ngOnInit(): void {
    if (this.userInformation['email']) {
      this.getPermissions();
    } else {
      this.loadedPermissions = true;
    }

    function getDataFromRoute(event: ActivationStart): string | undefined {
      if (event.snapshot.data && Object.keys(event.snapshot.data).length > 0) {
        return event.snapshot.data.display;
      }
    }
    function makeUrl(event: ActivationStart) {
      const url = event.snapshot.routeConfig?.path;

      const queryParams = event.snapshot.queryParams;

      const response =
        Object.entries(queryParams).length > 0
          ? Object.entries(queryParams)
              .map(([key, value]) => {
                return `${key}=${value}`;
              })
              .reduce((acc, curr) => {
                return `${acc}&${curr}`;
              })
          : undefined;

      if (response) {
        return `${url}?${response}`;
      }
      return url;
    }

    function getUrlFromRoute(event: ActivationStart): PathSegment | undefined {
      const path = makeUrl(event);
      if (path != undefined) {
        return {
          display: getDataFromRoute(event),
          path,
          fullPath: (event.snapshot as any)['_routerState'].url,
        };
      }
    }

    let pathsTemp: PathSegment[] = [];
    function resolveRoutes(paths: PathSegment[]) {}
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.state = true;
        resolveRoutes(pathsTemp);
      }

      if (event instanceof ActivationStart) {
        if (this.state) {
          this.state = false;
          this.paths = [];
          pathsTemp = [];
        }

        const data = getUrlFromRoute(event);
        if (data) {
          this.paths.push(data);
          pathsTemp.push(data);
        }
      }
    });
    getAuth(app).onAuthStateChanged((i) => {
      if (i) {
        this.getPermissions();
      }
    })

    // this.checkScreenWidth();
    // window.onresize = (event: any) => {
    //   this.checkScreenWidth();
    // };
  }
  getPermissions() {
    this.suscription?.unsubscribe();
    this.suscription = this.authorizationService
      .getToken(this.userInformation['email'])

      .subscribe((token) => {
        const tokenData = token.data;
        const data = decodeJwt(tokenData);
        const user = data.user;
        const resources: Array<any> = data.resources as Array<any>;
        console.log('User:: ', user);
        console.log('Resources:: ', resources);

        USER_INFORMATION['user'] = user;
        USER_INFORMATION['token'] = tokenData;

        this.user = this.userInformation.user;
        this.loadedPermissions = true;
        RESOURCES_PERMISSIONS.splice(0, RESOURCES_PERMISSIONS.length);
        RESOURCES_PERMISSIONS.push(
          ...resources.map((x) => {
            return x.name;
          })
        );
      });
  }
  closeSession() {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      USER_INFORMATION['user'] = undefined;
      USER_INFORMATION['token'] = undefined;
      this.user = undefined;

      this.drawer.close();

      this.router.navigate([AuthRoutingModule.route]);
    });
  }

  checkScreenWidth() {
    const width = window.innerWidth;
    for (const mode in this.typeBySize) {
      const func = (this.typeBySize as any)[mode];
      const response = func(width);

      if (response) {
        this.mode = mode as MatDrawerMode;
        this.cd.detectChanges();
        break;
      }
    }
  }
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
