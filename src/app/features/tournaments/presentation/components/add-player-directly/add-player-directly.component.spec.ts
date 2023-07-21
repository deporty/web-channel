import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlayerDirectlyComponent } from './add-player-directly.component';

describe('AddPlayerDirectlyComponent', () => {
  let component: AddPlayerDirectlyComponent;
  let fixture: ComponentFixture<AddPlayerDirectlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlayerDirectlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlayerDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
