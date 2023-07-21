import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeastBeatenGoalComponent } from './least-beaten-goal.component';

describe('LeastBeatenGoalComponent', () => {
  let component: LeastBeatenGoalComponent;
  let fixture: ComponentFixture<LeastBeatenGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeastBeatenGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeastBeatenGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
