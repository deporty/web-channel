import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsGottenComponent } from './cards-gotten.component';

describe('CardsGottenComponent', () => {
  let component: CardsGottenComponent;
  let fixture: ComponentFixture<CardsGottenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsGottenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsGottenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
