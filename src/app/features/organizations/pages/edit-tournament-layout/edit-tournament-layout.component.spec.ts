import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTournamentLayoutComponent } from './edit-tournament-layout.component';

describe('CreateTournamentComponent', () => {
  let component: EditTournamentLayoutComponent;
  let fixture: ComponentFixture<EditTournamentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTournamentLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTournamentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
