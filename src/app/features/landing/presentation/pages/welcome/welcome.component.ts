import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  static route = 'welcome';

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  constructor() {}
  ngAfterViewInit(): void {
    if (this.video) {
      console.log(this.video);
      
      this.video.nativeElement.muted = true;
      this.video.nativeElement.play();
    }

  }

  ngOnInit(): void {}
}
