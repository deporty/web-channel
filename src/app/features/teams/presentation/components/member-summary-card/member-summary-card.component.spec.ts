import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSummaryCardComponent } from './member-summary-card.component';

describe('PlayerSummaryCardComponent', () => {
  let component: MemberSummaryCardComponent;
  let fixture: ComponentFixture<MemberSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
