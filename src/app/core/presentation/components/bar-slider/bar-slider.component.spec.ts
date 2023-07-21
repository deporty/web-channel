import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarSliderComponent } from './bar-slider.component';

describe('BarSliderComponent', () => {
  let component: BarSliderComponent;
  let fixture: ComponentFixture<BarSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
