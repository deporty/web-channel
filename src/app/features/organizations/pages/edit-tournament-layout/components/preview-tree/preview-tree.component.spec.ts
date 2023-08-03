import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTreeComponent } from './preview-tree.component';

describe('PreviewTreeComponent', () => {
  let component: PreviewTreeComponent;
  let fixture: ComponentFixture<PreviewTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
