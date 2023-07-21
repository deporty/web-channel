import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore/lite';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'src/app/init-app';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {
  static route = 'quotation';
  formGroup: UntypedFormGroup;
  idResponse: string;
  error!: string;
  constructor(private router: Router) {
    this.idResponse = '';
    this.formGroup = new UntypedFormGroup({
      tournaments: new UntypedFormControl('', [Validators.required]),
      teams: new UntypedFormControl('', [Validators.required]),
      name: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      phone: new UntypedFormControl('', [
        Validators.minLength(10),
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

  sendQuotation() {
    const isValid = this.formGroup.valid;
    const value = this.formGroup.value;
    if (isValid) {
      this.error = '';
      const playerCollections = collection(firestore, 'quotations');

      from(
        addDoc(playerCollections, {
          tournaments: parseInt(value.tournaments),
          teams: parseInt(value.teams),
          email: value.email,
          name: value.name,
          phone: value.phone,
        })
      )
        .pipe(
          map((data: DocumentReference<DocumentData>) => {
            return data.id;
          })
        )
        .subscribe((id) => {
          this.idResponse = id;
        });
    } else {
      this.error =
        'Complete los campos para poder realizar una cotización exitosa. Revísalos por favor.';
    }
  }
}
