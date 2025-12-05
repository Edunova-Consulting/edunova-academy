import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { StudentService } from '../../../services/student.service';
import { Course } from '../../../models/course.model';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class TeacherStudentsComponent implements OnInit {
  courses: Course[] = [];
  students: Student[] = [];
  selectedCourse: Course | null = null;
  courseStudents: any[] = [];
  showForm: boolean = false;
  selectedStudentId: string = '';

  constructor(
    private courseService: CourseService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadStudents();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => this.students = students,
      error: (error) => console.error('Error loading students:', error)
    });
  }

  selectCourse(course: Course | null) {
    this.selectedCourse = course;
    if (course) {
      this.loadCourseStudents();
    } else {
      this.courseStudents = [];
    }
  }

  onCourseChange(courseId: string | null) {
    if (courseId) {
      const course = this.courses.find(c => c.id === courseId);
      this.selectCourse(course || null);
    } else {
      this.selectCourse(null);
    }
  }

  loadCourseStudents() {
    if (!this.selectedCourse) return;

    this.courseService.getCourseStudents(this.selectedCourse.id).subscribe({
      next: (students) => this.courseStudents = students,
      error: (error) => console.error('Error loading course students:', error)
    });
  }

  openForm() {
    this.showForm = true;
    this.selectedStudentId = '';
  }

  closeForm() {
    this.showForm = false;
  }

  assignStudent() {
    if (!this.selectedCourse || !this.selectedStudentId) return;

    this.courseService.assignStudentToCourse(this.selectedCourse.id, this.selectedStudentId).subscribe({
      next: () => {
        this.loadCourseStudents();
        this.closeForm();
      },
      error: (error) => console.error('Error assigning student:', error)
    });
  }
}

