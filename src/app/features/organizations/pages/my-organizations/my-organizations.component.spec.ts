import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationsComponent } from './my-organizations.component';

describe('OrganizationDetailComponent', () => {
  let component: MyOrganizationsComponent;
  let fixture: ComponentFixture<MyOrganizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOrganizationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
