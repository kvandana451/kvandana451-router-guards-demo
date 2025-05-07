import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseDetailsComponent } from '../../components/course-details/course-details.component';
import { CourseDetailsService } from '../../services/course-details.service';
import { Course } from '../../interfaces/coursesInfo';
import { Lesson } from '../../interfaces/lessons';
@Component({
  selector: 'app-confirmation-dialog',
  imports: [NgIf],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  changeDetectorRef: any;
  lessons?: Lesson[];
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Course | { courseid: number; lesson: string },
    private courseDetails: CourseDetailsService
  ) {}

  // Type guard check
  isData(data: Course | { courseid: number; lesson: string }) {
    if ((data as Course).id) {
      return true;
    }
    return false;
  }
  deleteCourse(data: Course | { courseid: number; lesson: string }) {
    let courses = this.courseDetails.getCourses();
    let result = courses.filter((item: Course) => {
      if (item.id !== (data as Course).id) {
        return true;
      }
      return false;
    });
    localStorage.setItem('courses', JSON.stringify(result));
    this.dialogRef.close(result);
  }
  cancel() {
    this.dialogRef.close();
  }
  deleteLesson(data: Course | { courseid: number; lesson: string }) {
    // console.log(data);
    // console.log((data as { courseid: number; lesson: string }).lesson);
    if (data as { courseid: number; lesson: string }) {
      let foundItem = this.lessons?.find(
        (item: Lesson) =>
          item.id === (data as { courseid: number; lesson: string }).courseid
      );
      let newLessons = foundItem?.lessons.filter(
        (item: string) =>
          item !== (data as { courseid: number; lesson: string }).lesson
      );
      let index;
      if (newLessons && foundItem) {
        foundItem.lessons = [...newLessons];
        index = this.lessons?.findIndex(
          (item: Lesson) => item.id === foundItem?.id
        );
        if (this.lessons && typeof index === 'number' && index >= 0) {
          this.lessons[index] = foundItem;
        }
      }

      localStorage.setItem('lessons', JSON.stringify(this.lessons));
      this.dialogRef.close(this.lessons);
    }
  }

  ngOnInit() {
    this.lessons = this.courseDetails.getLessons();
  }
}
