import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCardComponent } from './organization-card.component';

describe('OrganizationDetailComponent', () => {
  let component: OrganizationCardComponent;
  let fixture: ComponentFixture<OrganizationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
