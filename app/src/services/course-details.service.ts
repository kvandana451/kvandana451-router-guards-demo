import { Injectable } from '@angular/core';
import { Course } from '../interfaces/coursesInfo.js';
import { Lesson } from '../interfaces/lessons.js';
import { ProgressDetails } from '../interfaces/progressDetails.js';
import { EnrolledCourse } from '../interfaces/enrolledCourse.js';
@Injectable({
  providedIn: 'root',
})
export class CourseDetailsService {
  constructor() {
    this.storeCourses();
    this.storeLessons();
  }
  // DATA
  courses: Course[] = [
    {
      id: 1,
      name: 'Mobile App Development',
      desc: 'Mobile web development is the process of creating websites and apps for mobile devices like phones and tablets.',
    },
    {
      id: 2,
      name: 'Web Development',
      desc: 'Web development typically refers to the coding and programming side of website production.',
    },
    {
      id: 3,
      name: 'Analytics',
      desc: 'Data analytics is the science of analyzing raw data to make conclusions about that information. ',
    },
    {
      id: 4,
      name: 'DevOps',
      desc: 'DevOps is a software development practice that combines development and operations to improve the speed and reliability of software delivery. ',
    },
    {
      id: 5,
      name: 'Database Administration',
      desc: 'Database administration is the function of managing and maintaining database management systems (DBMS) software.',
    },
  ];

  // lessons for courses
  Lessons: Lesson[] = [
    {
      id: 1,
      lessons: [
        'Mobile Application',
        'Android App Development',
        'IOS App Development',
      ],
    },
    {
      id: 3,
      lessons: [' Linear regression', 'Logistic regression', 'data resampling'],
    },
    {
      id: 5,
      lessons: ['Database types ', 'Data warehouses ', 'Data modeling'],
    },
    {
      id: 4,
      lessons: [
        ' Understanding the Essence of DevOps',
        'Introduction to DevOps and Site Reliability Engineering Understanding the Essence of DevOps Cloud',
        'Cloud',
      ],
    },
    {
      id: 2,
      lessons: ['Mobile Application', 'CSS Fundamentals', 'Javascript'],
    },
  ];

  storeCourses() {
    if (!this.getCourses().length)
      localStorage.setItem('courses', JSON.stringify(this.courses));
  }
  getCourses(): Course[] {
    let storedData = localStorage.getItem('courses');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  }
  storeLessons() {
    if (!this.getLessons().length)
      localStorage.setItem('lessons', JSON.stringify(this.Lessons));
  }
  getLessons(): Lesson[] {
    let storedData = localStorage.getItem('lessons');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  }

  getEnrolledCourses(): EnrolledCourse[] {
    let enrolledCourses = localStorage.getItem('enrolledCourses');
    if (enrolledCourses) {
      return JSON.parse(enrolledCourses);
    }
    return [];
  }

  enrollCourse(course: Course | undefined): EnrolledCourse[] | undefined {
    if (course) {
      let enroll = this.getEnrolledCourses();
      // if (!enroll.includes(course.name)) {
      if (
        !enroll.some(
          (courseItem: EnrolledCourse) => courseItem.id === course?.id
        )
      ) {
        enroll.push({ id: course.id, name: course.name });

        localStorage.setItem('enrolledCourses', JSON.stringify(enroll));
        return enroll;
      }
      // }
    }
    return;
  }

  // tracks the lessons completed per course
  courseProgress: ProgressDetails[] = this.getCourseProgress();

  // getCourseProgress from local storage:
  getCourseProgress(): ProgressDetails[] {
    let storedData = localStorage.getItem('coursesProgress');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  }
}
