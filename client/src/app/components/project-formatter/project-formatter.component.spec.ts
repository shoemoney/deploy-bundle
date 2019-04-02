import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFormatterComponent } from './project-formatter.component';

describe('ProjectFormatterComponent', () => {
  let component: ProjectFormatterComponent;
  let fixture: ComponentFixture<ProjectFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
