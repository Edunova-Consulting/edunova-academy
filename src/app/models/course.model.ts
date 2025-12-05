export interface Course {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CourseTeacher {
  id: string;
  course_id: string;
  teacher_id: string;
  created_at?: string;
}

export interface CourseStudent {
  id: string;
  course_id: string;
  student_id: string;
  created_at?: string;
}

