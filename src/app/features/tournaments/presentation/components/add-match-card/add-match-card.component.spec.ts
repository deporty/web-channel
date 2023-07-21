import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMatchCardComponent } from './add-match-card.component';

describe('EditMatchCardComponent', () => {
  let component: AddMatchCardComponent;
  let fixture: ComponentFixture<AddMatchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMatchCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMatchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
