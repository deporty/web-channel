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
import { DEFAULT_PROFILE_IMG, userTokenKey } from './app.constants';
import { AuthorizationService } from './features/auth/infrastructure/services/authorization/authorization.service';
import { decodeJwt } from 'jose';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  breakpoint = 992;
  defaultImg: string;
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  loadedPermissions: boolean;
  mode: MatDrawerMode;
  paths: PathSegment[];
  state: boolean;
  suscription: any;
  title = 'sports-tournament';
  typeBySize = {
    side: (size: number) => {
      const r = size >= this.breakpoint;
      if (r) this.drawer?.open();
      return r;
    },
    over: (size: number) => {
      return size < this.breakpoint;
    },
  };

  menuOptions: any[];
  selectedOption!: string;
  user!: any;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    @Inject(RESOURCES_PERMISSIONS_IT) private resourcesPermissions: string[],
    @Inject(USER_INFORMATION_IT) protected userInformation: any,
    private authorizationService: AuthorizationService
  ) {
    this.defaultImg = DEFAULT_PROFILE_IMG;
    this.mode = 'side';
    this.paths = [];
    this.state = false;
    this.loadedPermissions = false;

    translate.setDefaultLang('es');
    translate.use('es');

    this.menuOptions = [
      {
        icon: 'apartment',
        enabled: () => {
          return this.isAllowedToViewOrganizations() && !!this.user;
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Mis Organizaciones',
        link: '/my-organizations',
      },
      {
        icon: 'admin_panel_settings',
        enabled: () => {
          return (
            !!this.user && this.user.email == 'sergio.posadaurrea@gmail.com'
          );
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Administración',
        link: '/admin',
      },
      {
        icon: 'sports_soccer',
        enabled: () => {
          return true;
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Torneos',
        link: '/tournaments',
      },
      {
        icon: 'groups',
        enabled: () => {
          return true;
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Equipos',
        link: '/teams',
      },
      {
        icon: 'people',
        enabled: () => {
          return (
            !!this.user && this.user.email == 'sergio.posadaurrea@gmail.com'
          );
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Usuarios',
        link: '/users',
      },
      {
        icon: 'contact_support',
        enabled: () => {
          return true;
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Wiki',
        link: '/wiki',
      },
      {
        icon: 'subject',
        enabled: () => {
          return true;
        },
        action: () => {
          this.mode == 'over' && this.drawer.close();
        },
        display: 'Acerca de',
        link: '/landing',
      },
    ];
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

  closeSession() {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      localStorage.removeItem(userTokenKey);

      USER_INFORMATION['user'] = undefined;
      USER_INFORMATION['token'] = undefined;
      this.user = null;
      this.drawer?.close();
      this.router.navigate([AuthRoutingModule.route]);
    });
  }

  getPermissions() {
    this.suscription?.unsubscribe();

    const previousToken = localStorage.getItem(userTokenKey);

    if (previousToken) {
      this.updateLoginSessionData(previousToken, userTokenKey);
    } else {
      this.suscription = this.authorizationService
        .getToken(this.userInformation['email'])

        .subscribe((response) => {
          const tokenData = response.data;
          console.log(tokenData);
          

          this.updateLoginSessionData(tokenData, userTokenKey);
        });
    }
  }

  isAllowedToViewOrganizations() {
    const identifier = 'view-organizations';
    return hasPermission(identifier, this.resourcesPermissions);
  }

  ngAfterViewInit(): void {
    this.checkScreenWidth();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
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
        this.selectedOption = event.url;
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
      } else {
        this.user = undefined;
      }
    });

    window.onresize = (event: any) => {
      this.checkScreenWidth();
    };
  }

  private updateLoginSessionData(tokenData: string, userTokenKey: string) {
    const data = decodeJwt(tokenData);

    const user = data.user;
    const resources: Array<any> = data.resources as Array<any>;

    USER_INFORMATION['user'] = user;
    USER_INFORMATION['token'] = tokenData;

    localStorage.setItem(userTokenKey, tokenData);

    this.user = this.userInformation.user;
    this.loadedPermissions = true;

    RESOURCES_PERMISSIONS.splice(0, RESOURCES_PERMISSIONS.length);
    RESOURCES_PERMISSIONS.push(
      ...resources.map((x) => {
        return x.name;
      })
    );
  }
}
