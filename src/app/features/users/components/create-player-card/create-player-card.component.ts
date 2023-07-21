import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IPlayerModel } from '@deporty-org/entities/players';
import { DEFAULT_PROFILE_IMG } from 'src/app/app.constants';

@Component({
  selector: 'app-create-player-card',
  templateUrl: './create-player-card.component.html',
  styleUrls: ['./create-player-card.component.scss'],
})
export class CreatePlayerCardComponent implements OnInit {
  formGroup: UntypedFormGroup;

  @Output() onCreatePlayer: EventEmitter<any>;
  file!: File;
  fileUrl!: string;
  fileUrlDefault: string;
  constructor() {
    this.fileUrlDefault = DEFAULT_PROFILE_IMG;
    this.onCreatePlayer = new EventEmitter();
    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl(''),
      document: new UntypedFormControl('', Validators.required),
      lastName: new UntypedFormControl('', Validators.required),
      image: new UntypedFormControl(''),
    });
  }

  ngOnInit(): void {}

  onSelectedFile(event: any) {
    this.file = event.file;
    this.fileUrl = event.url;
    this.formGroup.get('image')?.setValue(this.fileUrl);
  }
  createPlayer() {
    const value: IPlayerModel = this.formGroup.value;
    const isValid = this.formGroup.valid;
    if (isValid) {
      this.onCreatePlayer.emit({ playerData: value, img: this.file });
    }
  }
}
