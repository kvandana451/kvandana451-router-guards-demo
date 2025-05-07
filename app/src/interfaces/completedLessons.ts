export interface completedLessons {
  courseId: number;
  lessons: {
    [key: string]: boolean | number;
  };
}
