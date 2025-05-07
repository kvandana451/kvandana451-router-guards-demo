import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CourseDetailsService } from '../../services/course-details.service';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../../interfaces/coursesInfo';
import { AuthService } from '../../services/auth.service';
import { EnrolledCourse } from '../../interfaces/enrolledCourse';
@Component({
  selector: 'app-courses',
  imports: [NgFor, RouterLink, NgIf],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  constructor(
    private authService: AuthService,
    private courseService: CourseDetailsService,
    private router: Router
  ) {}

  courses?: Course[];
  enrolledCourses?: EnrolledCourse[];

  enroll(course: Course, $event: any) {
    let enrollBtnId = Number($event?.target.dataset.id);
    this.enrolledCourses = this.courseService.enrollCourse(course);
  }

  unenroll(course: Course) {
    if (this.enrolledCourses?.length) {
      let foundItem = this.enrolledCourses?.find(
        (item: EnrolledCourse) => item.id === course.id
      );
      let index = this.enrolledCourses?.findIndex(
        (item: EnrolledCourse) => item.id === foundItem?.id
      );

      if (index > -1) {
        this.enrolledCourses?.splice(index, 1);
        localStorage.setItem(
          'enrolledCourses',
          JSON.stringify(this.enrolledCourses)
        );
        this.enrolledCourses = this.enrolledCourses;
      }
    }
  }

  gotocourseDetails(course: Course, $event: any) {
    $event.preventDefault();
    this.router.navigate([`/course-details/${course.id}`]);
  }

  checkEnrolledCourses(course: Course): EnrolledCourse | undefined | null {
    if (this.enrolledCourses?.length) {
      return this.enrolledCourses.find(
        (item: EnrolledCourse) => item.id === course.id
      );
    }
    return null;
  }
  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.courses = this.courseService.getCourses();
    this.enrolledCourses = this.courseService.getEnrolledCourses();
  }
}
