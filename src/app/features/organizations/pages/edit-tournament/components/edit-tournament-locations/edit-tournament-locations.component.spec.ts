import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTournamentLocationsComponent } from './edit-tournament-locations.component';

describe('EditTournamentLocationsComponent', () => {
  let component: EditTournamentLocationsComponent;
  let fixture: ComponentFixture<EditTournamentLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTournamentLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTournamentLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
