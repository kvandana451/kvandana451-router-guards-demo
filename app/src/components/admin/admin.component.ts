import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CourseDetailsService } from '../../services/course-details.service';
import { NgFor, NgIf } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogCoursesComponent } from '../../dialogs/dialog-courses/dialog-courses.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { UserInfo } from '../../interfaces/userInfo';
import { Course } from '../../interfaces/coursesInfo';
import { Lesson } from '../../interfaces/lessons';

@Component({
  selector: 'app-admin',
  imports: [NgFor, MatDialogModule, NgIf],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  userInfo?: UserInfo;
  courses?: Course[];
  lessons?: Lesson[];
  isSelectedNewLesson?: any;
  isClicked?: Lesson;
  isNoCourseId: any;
  constructor(
    private authService: AuthService,
    private courseDetails: CourseDetailsService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  // Dialog
  openDialog() {
    const dialogVal = this.dialog.open(DialogCoursesComponent, {
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      height: '60%',
      width: '50%',
      panelClass: 'dialog-responsive',
    });
    dialogVal.afterClosed().subscribe((val: Course[]) => {
      if (val) {
        this.courses = val;
      }
    });
  }
  openEditDialog(course: Course) {
    const dialogVal = this.dialog.open(DialogCoursesComponent, {
      height: '60%',
      width: '50%',
      data: course,
    });
    dialogVal.afterClosed().subscribe((val: Course[]) => {
      if (val) {
        this.courses = val;
      }
    });
  }
  openConfirmationDialog(deleteCourse: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '50%',
      width: '50%',
      data: deleteCourse,
    });
    dialogRef.afterClosed().subscribe((result: Course[]) => {
      if (result) {
        this.courses = result;
      }
    });
  }
  onClick(e: any, course: Course) {
    let foundItem;
    e.preventDefault();
    if (this.isClicked?.id === course.id) {
      this.isClicked = undefined;
      return;
    }
    foundItem = this.lessons?.find((item: Lesson) => {
      if (item.id === course.id) {
        return item;
      }
      return;
    });
    this.isClicked = foundItem; //lessons for that course

    if (!foundItem) {
      if (this.isNoCourseId) {
        this.isNoCourseId = undefined;
        return;
      }
      this.isNoCourseId = course.id;
    }
  }
  editLessons(isClicked: Lesson | undefined) {
    const dialogRef = this.dialog.open(DialogCoursesComponent, {
      data: isClicked,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isClicked = result;
        this.lessons = result;
      }
    });
  }
  deleteLesson(courseId: number | undefined, lesson: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '50%',
      width: '50%',
      data: { courseid: courseId, lesson },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Fetch latest courses from localStorage
        this.lessons = result;
        this.isClicked = this.lessons?.find(
          (item: Lesson) => item.id === this.isClicked?.id
        );
      }
    });
  }
  addLesson(courseId: number) {
    const diaRef = this.dialog.open(DialogCoursesComponent, {
      data: courseId,
    });
    diaRef.afterClosed().subscribe((res) => {
      if (res) {
        this.isNoCourseId = undefined;
        this.isClicked = undefined;
        this.lessons = res;
      }
    });
  }
  logout() {
    this.authService.logout();
  }
  ngOnInit() {
    this.userInfo = this.authService.getUserInfo();
    this.courses = this.courseDetails.getCourses();
    this.lessons = this.courseDetails.getLessons();
  }
}
