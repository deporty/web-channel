import { Component, OnInit } from '@angular/core';
import { Breakpoints, IAdModel } from '../../../entities/ad.model';

const TIME = 25000;
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  ads: IAdModel[];
  breakpoint!: string;
  index: number;
  table: any;
  currentUrl!: string;
  link: string | undefined;

  constructor() {
    this.index = 0;
    this.breakpoint = this.getBreakpoint(window.innerWidth);
    this.table = {};

    this.ads = [
      {
        adBreakpoint: {
          xs: 'assets/banners/xs.jpg',
          sm: 'assets/banners/s.jpg',
          md: 'assets/banners/md.jpg',
          lg: 'assets/banners/lg.jpg',
          xl: 'assets/banners/xl.jpg',
        },
        counterClicks: 0,
        defaultAd: 'md',
        id: 'd',
        status: 'active',
        title: 'Academía de Artes',
        link: 'https://www.instagram.com/linea__artistica/',
      },
    ];
  }

  getBreakpoint(width: number) {
    const map: any = {
      xs: (size: number) => {
        return size < 576;
      },
      sm: (size: number) => {
        return size >= 576 && size < 768;
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

  addCounter() {
    const currentAd = this.ads[this.index];
    currentAd.counterClicks =
      currentAd.counterClicks && currentAd.counterClicks >= 0
        ? currentAd.counterClicks + 1
        : 1;
    // this.adAdapter.updateAd(currentAd);
  }

  selectImage() {
    let currentIndex = Math.round(Math.random() * (this.ads.length - 1));

    while (currentIndex == this.index && this.ads.length != 1) {
      currentIndex = Math.round(Math.random() * (this.ads.length - 1));
    }
    this.index = currentIndex;
  }
  ngOnInit(): void {
    this.selectImage();
    this.getImage();
    // this.getAdsUsecase.call().subscribe((ads) => {
    //   this.ads = ads;
    //   this.selectImage();
    //   this.getImage();
    // });

    window.addEventListener('resize', () => {
      const widht = window.innerWidth;
      this.breakpoint = this.getBreakpoint(widht);
      this.getImage();
    });

    setInterval(() => {
      if (this.ads) {
        this.selectImage();
        this.getImage();
      }
    }, TIME);
  }

  getImage() {
    if (this.ads && this.ads.length > this.index) {
      const key = `${this.index}-${this.breakpoint}`;
      let previusValue = this.table[key];
      if (!previusValue) {
        const path: string =
          this.ads[this.index].adBreakpoint[this.breakpoint as Breakpoints];
        this.table[key] = path;
        previusValue = this.table[key];
      }
      this.currentUrl = previusValue;
      this.link = this.ads[this.index].link;
    }
  }
}
