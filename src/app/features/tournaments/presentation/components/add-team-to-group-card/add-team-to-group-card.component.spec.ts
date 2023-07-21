import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamToGroupCardComponent } from './add-team-to-group-card.component';

describe('AddTeamCardComponent', () => {
  let component: AddTeamToGroupCardComponent;
  let fixture: ComponentFixture<AddTeamToGroupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTeamToGroupCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamToGroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
