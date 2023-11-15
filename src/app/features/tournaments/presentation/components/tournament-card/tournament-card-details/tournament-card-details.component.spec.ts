import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCardDetailsComponent } from './tournament-card-details.component';

describe('TournamentCardDetailsComponent', () => {
  let component: TournamentCardDetailsComponent;
  let fixture: ComponentFixture<TournamentCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentCardDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
