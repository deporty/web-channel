import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleProggressIndicatorComponent } from './circle-proggress-indicator.component';

describe('CircleProggressIndicatorComponent', () => {
  let component: CircleProggressIndicatorComponent;
  let fixture: ComponentFixture<CircleProggressIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleProggressIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleProggressIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
