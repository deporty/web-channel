import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocVisualizatorComponent } from './doc-visualizator.component';

describe('DocVisualizatorComponent', () => {
  let component: DocVisualizatorComponent;
  let fixture: ComponentFixture<DocVisualizatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocVisualizatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocVisualizatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
