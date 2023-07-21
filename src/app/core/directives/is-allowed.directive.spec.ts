import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsAllowedDirective } from './is-allowed.directive';

describe('IsAllowedDirective', () => {
  let directive: IsAllowedDirective;
  let fixture: ComponentFixture<IsAllowedDirective>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsAllowedDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsAllowedDirective);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
