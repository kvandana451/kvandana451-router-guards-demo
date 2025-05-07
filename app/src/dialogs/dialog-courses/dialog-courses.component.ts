import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CourseDetailsService } from '../../services/course-details.service';
import { NgFor, NgIf } from '@angular/common';
import { Course } from '../../interfaces/coursesInfo';
import { Lesson } from '../../interfaces/lessons';
@Component({
  selector: 'app-dialog-courses',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './dialog-courses.component.html',
  styleUrl: './dialog-courses.component.scss',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        autoFocus: 'dialog',
        restoreFocus: true,
      },
    },
  ],
})
export class DialogCoursesComponent {
  addCourseForm?: FormGroup;
  CourseForm?: FormGroup;
  editLessonsForm?: FormGroup;
  addLessonForm?: FormGroup;
  courses?: Course[];
  lessons?: string[];
  courseLessons?: Lesson[];
  deleteData?: any;
  constructor(
    public dialogRef: MatDialogRef<DialogCoursesComponent>,
    private courseService: CourseDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: Course | Lesson | number //  public data: { courseData: Course; lessonData: Lesson }
  ) {
    this.addCourseForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      desc: new FormControl(),
    });
    this.CourseForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      desc: new FormControl(),
    });
    this.editLessonsForm = new FormGroup({
      lessonsArray: new FormArray([]),
    });
    this.addLessonForm = new FormGroup({
      id: new FormControl(),
      addlessonsArray: new FormArray([new FormControl('')]),
    });
  }
  saveCourse() {
    if (this.addCourseForm?.valid) {
      const addCourseForm = {
        ...this.addCourseForm?.value,
        id: Number(this.addCourseForm?.value?.id),
      };
      this.courses?.push(addCourseForm);
      localStorage.setItem('courses', JSON.stringify(this.courses));
      this.addCourseForm.reset();
      this.dialogRef.close(this.courses);
    }
  }
  closeDialog() {
    this.dialogRef.close(true);
  }
  // edit the course
  updateCourse(value: Course | Lesson | Number) {
    if ((value as Course).id) {
      let result = this.courses?.filter((item) => {
        if (item.id !== (value as Course).id) {
          return item;
        }
        return;
      });
      result?.push(this.CourseForm?.value);
      localStorage.setItem('courses', JSON.stringify(result));
      this.courses = result;
      this.CourseForm?.reset();
      this.dialogRef.close(this.courses);
    }
  }
  cancelChanges() {
    this.dialogRef.close();
  }

  // TYPE GUARD
  isLessons(data: Course | Lesson | Number): boolean {
    if (typeof data === 'number') {
      return true;
    }
    if ((data as Lesson) && (data as Lesson).lessons) {
      this.lessons = (data as Lesson).lessons;

      return true;
    }
    return false;
  }
  // Helper function to get FormArray
  get lessonsArray(): FormArray {
    return this.editLessonsForm?.get('lessonsArray') as FormArray;
  }

  updateLessons(data: Course | Lesson | number) {
    let updatedLessons = this.editLessonsForm?.value.lessonsArray;
    let oldLesson = this.courseLessons?.find(
      (item: Lesson) => item.id === (data as Lesson).id
    );
    if (oldLesson) {
      oldLesson.lessons = [...updatedLessons]; //here oldLesson is updated
      // update only that updated-lesson in the local storage
    }
    let index = this.courseLessons?.findIndex(
      (item: Lesson) => item.id === oldLesson?.id
    );

    if (
      oldLesson &&
      this.courseLessons &&
      typeof index === 'number' &&
      index >= 0
    ) {
      this.courseLessons[index].lessons = oldLesson?.lessons;
    }
    localStorage.setItem('lessons', JSON.stringify(this.courseLessons));
    this.dialogRef.close(this.courseLessons);

    console.log('The lessons which you have editted got saved successfully!!');
  }
  cancelUpdatingLessons() {
    this.dialogRef.close('true');
  }

  get addlessonsArray() {
    return this.addLessonForm?.get('addlessonsArray') as FormArray;
  }

  addLesson(data: Course | Number | Lesson) {
    let foundItem = this.courseLessons?.find(
      (item: Lesson) => item.id === data //here data is id
    );
    if (!foundItem) {
      const updatedData = {
        id: this.addLessonForm?.value.id,
        lessons: [...this.addLessonForm?.value?.addlessonsArray], // Renaming the key
      };
      this.courseLessons?.push(updatedData);
      localStorage.setItem('lessons', JSON.stringify(this.courseLessons));
      this.addLessonForm?.controls['addlessonsArray'].reset();
    } else {
      // checks whether the newly lesson alreadyExists
      const lessonExists = foundItem.lessons.includes(
        this.addLessonForm?.get('addlessonsArray')?.value[0]
      );
      if (lessonExists) {
        this.addLessonForm?.controls['addlessonsArray'].reset();

        return;
      }
      // }
      foundItem.lessons.push(
        this.addLessonForm?.get('addlessonsArray')?.value[0]
      );
      this.addLessonForm?.controls['addlessonsArray'].reset();

      // let foundStoredLesson = this.courseLessons?.find(
      //   (item: Lesson) => item.id === foundItem.id
      // );
      // if (foundStoredLesson) {
      //   foundStoredLesson.lessons = [...foundItem.lessons];
      //   console.log(foundStoredLesson?.id);
      // }

      let index = this.courseLessons?.findIndex(
        (item: Lesson) => item.id === foundItem?.id
      );
      if (this.courseLessons && typeof index === 'number' && index >= 0) {
        this.courseLessons[index] = foundItem;
      }
      localStorage.setItem('lessons', JSON.stringify(this.courseLessons));
    }
    console.log('lessons are added successfully spontaneously!!');
    this.dialogRef.close(this.courseLessons);
  }

  cancelAddingLessons() {
    this.dialogRef.close('true');
  }

  ngOnInit() {
    this.courseLessons = this.courseService.getLessons();
    this.courses = this.courseService.getCourses();
    this.deleteData = this.data;
    if (!this.isLessons(this.data)) {
      if (this.CourseForm?.valid) {
        this.CourseForm.patchValue(this.data as Course);
        return;
      }
    }
    if (typeof this.data !== 'number') {
      if (this.isLessons(this.data)) {
        (this.data as Lesson).lessons.forEach((lesson) => {
          this.lessonsArray.push(new FormControl(lesson));
        });
      }
    }
    this.addLessonForm?.get('id')?.patchValue(this.data);
  }
}
