import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileUsecase } from 'src/app/core/usecases/upload-file/upload-file';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss'],
})
export class CreatePlayerComponent implements OnInit {
  static route = 'create-player';
  error!: string;
  status!: string;
  constructor(
    private uploadFileUsecase: UploadFileUsecase,
    private router: Router,
  ) {}

  createPlayer(value: any) {
    if (value) {
      const newPlayer = { ...value.playerData };
      this.status = 'pending';
      // this.playerService.createPlayer(newPlayer).subscribe((data) => {
      //   if (data.meta.code !== 'PLAYER-POST:SUCCESS') {
      //     this.status = '';
      //     this.error = data.meta.message;
      //   } else {
      //     this.router.navigate([UsersRoutingModule.route]);
      //   }
      // });
    }
  }

  ngOnInit(): void {
    // this.store.dispatch(
    //   GET_ALL_USERS_ACTION({ usernamae: 'username', password: 'password' })
    // );
  }
}
