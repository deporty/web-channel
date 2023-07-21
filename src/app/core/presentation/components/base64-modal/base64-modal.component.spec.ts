import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Base64ModalComponent } from './base64-modal.component';

describe('Base64ModalComponent', () => {
  let component: Base64ModalComponent;
  let fixture: ComponentFixture<Base64ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Base64ModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Base64ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
