import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequiredDocConfig } from '@deporty-org/entities/organizations';

function noContieneEspacios(control: FormControl) {
  const value: string = control.value;
  if (value && !value.includes(' ')) {
    return null; // Válido
  }
  return { contieneEspacios: true }; // No válido
}

function longitudMaxima(length: number) {
  return (control: FormControl) => {
    const value = control.value;
    if (value && value.length <= length) {
      return null; // Válido
    }
    return { largoExcedido: true }; // No válido
  };
}

@Component({
  selector: 'app-require-docs',
  templateUrl: './require-docs.component.html',
  styleUrls: ['./require-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequireDocsComponent implements OnInit {
  @Input('required-docs') requiredDocs!: RequiredDocConfig[] | undefined;

  @Output('on-change-configuration') onChangeConfiguration = new EventEmitter<
    RequiredDocConfig[]
  >();
  currentRequireDocs!: RequiredDocConfig[];
  formGroup: FormGroup;

  applyToMapper = {
    player: 'Jugador',
    team: 'Equipo',
  };
  constructor() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      alias: new FormControl('', [
        Validators.required,
        noContieneEspacios,
        longitudMaxima(3),
      ]),
      description: new FormControl('', Validators.required),
      applyTo: new FormControl('player', Validators.required),
      fileKind: new FormControl(['pdf'], Validators.required),
    });
  }

  ngOnInit(): void {
    this.currentRequireDocs = [];
    if (this.requiredDocs) {
      this.currentRequireDocs = [...this.requiredDocs];
    }
  }

  addRequiredDoc() {
    if (this.formGroup.valid) {
      this.currentRequireDocs.push({
        ...this.formGroup.value,
        status: 'enabled',
      });

      this.onChangeConfiguration.emit(this.currentRequireDocs);
    }
  }

  deleteRequiredDoc(index: number) {
    const temp = [...this.currentRequireDocs];
    temp.splice(index, 1);
    this.currentRequireDocs = temp;
    this.onChangeConfiguration.emit(this.currentRequireDocs);
  }
}
