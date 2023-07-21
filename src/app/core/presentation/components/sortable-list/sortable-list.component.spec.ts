import { ComponentFixture, TestBed } from '@angular/core/testing';


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
