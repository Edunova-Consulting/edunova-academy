import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { TeacherService } from '../../../services/teacher.service';
import { StudentService } from '../../../services/student.service';
import { Course } from '../../../models/course.model';
import { Teacher } from '../../../models/teacher.model';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-course-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-assignments.component.html',
  styleUrl: './course-assignments.component.scss'
})
export class CourseAssignmentsComponent implements OnInit {
  courses: Course[] = [];
  teachers: Teacher[] = [];
  students: Student[] = [];
  selectedCourse: Course | null = null;
  courseTeachers: any[] = [];
  courseStudents: any[] = [];
  showTeacherForm: boolean = false;
  showStudentForm: boolean = false;
  selectedTeacherId: string = '';
  selectedStudentId: string = '';

  constructor(
    private courseService: CourseService,
    private teacherService: TeacherService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadTeachers();
    this.loadStudents();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => this.teachers = teachers,
      error: (error) => console.error('Error loading teachers:', error)
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
      this.loadCourseAssignments();
    } else {
      this.courseTeachers = [];
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

  loadCourseAssignments() {
    if (!this.selectedCourse) return;

    this.courseService.getCourseTeachers(this.selectedCourse.id).subscribe({
      next: (teachers) => this.courseTeachers = teachers,
      error: (error) => console.error('Error loading course teachers:', error)
    });

    this.courseService.getCourseStudents(this.selectedCourse.id).subscribe({
      next: (students) => this.courseStudents = students,
      error: (error) => console.error('Error loading course students:', error)
    });
  }

  openTeacherForm() {
    this.showTeacherForm = true;
    this.selectedTeacherId = '';
  }

  openStudentForm() {
    this.showStudentForm = true;
    this.selectedStudentId = '';
  }

  closeForms() {
    this.showTeacherForm = false;
    this.showStudentForm = false;
  }

  assignTeacher() {
    if (!this.selectedCourse || !this.selectedTeacherId) return;

    this.courseService.assignTeacherToCourse(this.selectedCourse.id, this.selectedTeacherId).subscribe({
      next: () => {
        this.loadCourseAssignments();
        this.closeForms();
      },
      error: (error) => console.error('Error assigning teacher:', error)
    });
  }

  assignStudent() {
    if (!this.selectedCourse || !this.selectedStudentId) return;

    this.courseService.assignStudentToCourse(this.selectedCourse.id, this.selectedStudentId).subscribe({
      next: () => {
        this.loadCourseAssignments();
        this.closeForms();
      },
      error: (error) => console.error('Error assigning student:', error)
    });
  }
}

