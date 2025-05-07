import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCoursesComponent } from './dialog-courses.component';

describe('DialogCoursesComponent', () => {
  let component: DialogCoursesComponent;
  let fixture: ComponentFixture<DialogCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
