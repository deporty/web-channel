import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsFinancialStatementsComponent } from './tournaments-financial-statements.component';

describe('TournamentsFinancialStatementsComponent', () => {
  let component: TournamentsFinancialStatementsComponent;
  let fixture: ComponentFixture<TournamentsFinancialStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentsFinancialStatementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentsFinancialStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
