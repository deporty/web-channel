import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdDirective } from './ad.directive';

describe('AdDirective', () => {
  let directive: AdDirective;
  let fixture: ComponentFixture<AdDirective>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDirective);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
