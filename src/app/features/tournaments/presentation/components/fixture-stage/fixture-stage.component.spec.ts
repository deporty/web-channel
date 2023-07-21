import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureStageComponent } from './fixture-stage.component';

describe('FixtureStageComponent', () => {
  let component: FixtureStageComponent;
  let fixture: ComponentFixture<FixtureStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureStageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixtureStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
