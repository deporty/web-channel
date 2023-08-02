import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import defaultNew from '../../../../news/infrastructure/default-new';
import {
  getCurrentGeolocation,
  trackEvent,
} from 'src/app/core/helpers/log-events.helper';
import { UsersRoutingModule } from 'src/app/features/users/users-routing.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  static route = 'index';

  breakpoint!: string;
  defaultNew = defaultNew;
  generalGoodAspects = [
    {
      title: 'Paga lo que uses',
      description:
        'Nuestra filosofía es "paga por lo que usas". Si tu torneo no es tan grande no deberías pagar una cuota fija. De esta manera recibirás exactamente lo que necesitas.',
    },
    {
      title: 'Paga menos entre más uses',
      description:
        'Premiamos a quienes confian en nosotros, por tanto tenemos un sistema progresivo que te otorgará descuentos a medida que estés con Deporty.',
    },
    {
      title: 'Automatización',
      description: 'Nuestro objetivo es que realices todas las acciones sobre los torneos fácilmente.',
    },
    {
      title: 'Funcionalidades',
      description: 'Contamos con gestión de equipos, estadísticas, planilla, firma digital, tabla de posiciones automática, plantillas de torneos, gestión de localidades y árbitros.',
    },

  ];
  modules = [
    {
      name: 'Torneos',
      description:
        'Aquí podrá ver y gestionar, los torneos de más impacto. Sumérgete en esta gran experiencia',
      img: 'assets/tournament-preview.jpg',
      route: 'tournaments',
    },
    {
      name: 'Equipos',
      description:
        'Aquí podrá crear, editar y ver equipos, al igual que sus integrantes y demás información.',
      img: 'assets/teams-preview.jpg',
      route: 'teams',
    },

    // {
    //   name: 'Jugadores',
    //   description:
    //     'Encuentre toda la información de los jugadores que han participado en los torneos realizados.',
    //   img: 'assets/player-preview.jpg',
    //   route: 'players',
    // },
  ];
  path!: string;

  constructor(private router: Router) {}

  getBreakpoint(width: number) {
    const map: any = {
      sm: (size: number) => {
        return size < 768;
      },

      md: (size: number) => {
        return size >= 768 && size < 992;
      },

      lg: (size: number) => {
        return size >= 992 && size < 1200;
      },

      xl: (size: number) => {
        return size >= 1200;
      },
    };
    for (const breakpoint in map) {
      if (Object.prototype.hasOwnProperty.call(map, breakpoint)) {
        const func = map[breakpoint];
        const response = func(width);
        if (response) {
          return breakpoint;
        }
      }
    }
    return 'md';
  }

  goModule(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.selectImage();
    getCurrentGeolocation().subscribe((data) => {
      trackEvent('index_views', data);
    });

    window.addEventListener('resize', () => {
      this.selectImage();
    });
  }

  selectImage() {
    const widht = window.innerWidth;
    this.breakpoint = this.getBreakpoint(widht);
    this.path = `../assets/index/manizales-copa/${this.breakpoint}.jpg`;
  }
}
