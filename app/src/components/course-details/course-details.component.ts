import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDetailsService } from '../../services/course-details.service';
import { NgFor, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { YOUTUBE_PLAYER_CONFIG, YouTubePlayer } from '@angular/youtube-player';
import { Course } from '../../interfaces/coursesInfo';
import { Lesson } from '../../interfaces/lessons';
import { ProgressDetails } from '../../interfaces/progressDetails';
import { completedLessons } from '../../interfaces/completedLessons';
import { AuthService } from '../../services/auth.service';
import { EnrolledCourse } from '../../interfaces/enrolledCourse';

@Component({
  selector: 'app-course-details',
  imports: [NgIf, NgFor, RouterLink, MatExpansionModule, YouTubePlayer],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
})
export class CourseDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseDetailsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.courseId = Number(this.route.snapshot.params['id']);
  }
  courseId?: number;
  selectedCourseDetails?: Course;
  lessons?: Lesson;
  enrolledCourse?: EnrolledCourse[]; //which are all the courses enrolled
  ifenrolled?: EnrolledCourse;
  completedLessons?: string | null; //completed lessons for each course

  // gets course Details of selected Course,to display
  getCourse(): Course | undefined {
    const id = Number(this.route.snapshot.params['id']);
    let enrolledCourse = this.courseService
      .getCourses()
      .find((item: Course) => {
        if (item.id === id) {
          return item;
        }
        return;
      });
    return enrolledCourse;
  }
  // getLessons for that particular course
  getLesson(): Lesson | undefined {
    return this.courseService
      .getLessons()
      .find((item: Lesson) => item.id === this.selectedCourseDetails?.id);
  }
  // displays lessons only if enrolled
  displayLessons(): EnrolledCourse | undefined {
    let result = this.enrolledCourse?.find((item: EnrolledCourse) => {
      if (item.id === this.getCourse()?.id) {
        return item;
      }
      return;
    });
    return result;
  }
  // Mark the course as completed to study

  isCompleted: completedLessons[] = [];
  markAsCompleteBtnId?: number;
  markComplete($event: any, lesson: string) {
    this.markAsCompleteBtnId = Number($event?.target.dataset.id);

    if (this.completedLessons) {
      this.isCompleted = JSON.parse(this.completedLessons);
      //here found item refers to the item whose courseId already exists we just need to push lessons
      let foundItem = this.isCompleted.find(
        (item) => item.courseId === this.courseId
      );
      if (foundItem) {
        foundItem.lessons = {
          ...foundItem?.lessons,
          [`${lesson}`]: true,
        };
      } else {
        if (this.courseId) {
          this.isCompleted.push({
            courseId: this.courseId,
            lessons: {
              [`${lesson}`]: true,
            },
          });
        }
      }
    }
    if (!this.completedLessons && this.courseId) {
      this.isCompleted.push({
        courseId: this.courseId,
        lessons: {
          [`${lesson}`]: true,
        },
      });
    }
    let stringifiedResult = JSON.stringify(this.isCompleted);
    localStorage.setItem('completedButtons', stringifiedResult);
    this.completedLessons = stringifiedResult;
    this.setCompletedLessonsCount();
  }

  // Check whether lessons are completed or not
  checkLessonsStatus(lesson: string): boolean {
    if (this.completedLessons) {
      let result = JSON.parse(this.completedLessons);
      return result.some((item: completedLessons) => {
        let obj = item.lessons;
        let arrayResult = Object.keys(obj);
        return item.courseId === this.courseId && arrayResult.includes(lesson);
      });
    }
    return false;
  }

  getCompletedButtons(): string | null {
    let storedButtons = localStorage.getItem('completedButtons');
    return storedButtons;
  }

  setCompletedLessonsCount() {
    let totalCount = this.lessons?.lessons.length;
    if (this.completedLessons) {
      let arrayResult = JSON.parse(this.completedLessons);
      let completedLessonsPerCourse: ProgressDetails[] = [];
      arrayResult.forEach((item: completedLessons) => {
        let obj = item.lessons;
        if (totalCount) {
          completedLessonsPerCourse.push({
            courseId: item.courseId,
            completedCount: Object.keys(obj).length,
            total: totalCount,
          });
        }
      });
      localStorage.setItem(
        'completedLessonsCount',
        JSON.stringify(completedLessonsPerCourse)
      );
    }
  }

  goToCourses() {
    this.router.navigate(['/courses']);
  }
  enroll() {
    let enrollCourse = this.getCourse();
    this.enrolledCourse = this.courseService.enrollCourse(enrollCourse);
    this.ifenrolled = this.displayLessons();
    this.lessons = this.getLesson();
  }
  logout() {
    this.authService.logout();
  }
  ngOnInit() {
    this.getCourse();
    this.selectedCourseDetails = this.getCourse();
    this.lessons = this.getLesson();
    this.enrolledCourse = this.courseService.getEnrolledCourses();
    this.ifenrolled = this.displayLessons();
    this.setCompletedLessonsCount();
    this.completedLessons = this.getCompletedButtons();
  }
}
