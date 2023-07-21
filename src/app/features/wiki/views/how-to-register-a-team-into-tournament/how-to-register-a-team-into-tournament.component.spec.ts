import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToRegisterATeamIntoTournamentComponent } from './how-to-register-a-team-into-tournament.component';

describe('HowToRegisterATeamIntoTournamentComponent', () => {
  let component: HowToRegisterATeamIntoTournamentComponent;
  let fixture: ComponentFixture<HowToRegisterATeamIntoTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowToRegisterATeamIntoTournamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToRegisterATeamIntoTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
