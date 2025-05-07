import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseDetailsService } from '../../services/course-details.service';
import { Course } from '../../interfaces/coursesInfo';
import { ProgressDetails } from '../../interfaces/progressDetails';
import { EnrolledCourse } from '../../interfaces/enrolledCourse';
import { UserInfo } from '../../interfaces/userInfo';
@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  userInfo?: UserInfo;
  enrolledCourses?: EnrolledCourse[];
  progress?: ProgressDetails[];

  constructor(
    private authService: AuthService,
    private courseService: CourseDetailsService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.enrolledCourses = this.courseService.getEnrolledCourses();
  }

  unEnroll(courseName: EnrolledCourse) {
    this.enrolledCourses = this.enrolledCourses?.filter((item) => {
      return item.id !== courseName.id;
    });

    localStorage.setItem(
      'enrolledCourses',
      JSON.stringify(this.enrolledCourses)
    );
  }
  getCourseProgress(): ProgressDetails[] {
    let storedData = localStorage.getItem('completedLessonsCount');
    if (storedData?.length) {
      let result = JSON.parse(storedData);
      // this.progress = result;
      return result;
    }
    return [];
  }
  isMatchingCourse(dataId: number, enrolledCourseId: number): boolean {
    if (dataId === enrolledCourseId) {
      return true;
    }
    return false;
  }
  // does enrolledcourseId exists in completedCourseButtons
  doesCourseIdExist(enrolledId: number): boolean {
    if (this.progress?.length) {
      let finalResult = this.progress.find((item: ProgressDetails) => {
        return item.courseId === enrolledId;
      });
      if (finalResult) {
        return true;
      } else {
        return false;
      }
    }
    // }
    return false;
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.progress = this.getCourseProgress();
  }
}
