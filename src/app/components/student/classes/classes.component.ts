import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../../services/class.service';
import { CourseService } from '../../../services/course.service';
import { Class } from '../../../models/class.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-student-classes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class StudentClassesComponent implements OnInit {
  classes: Class[] = [];
  courses: Course[] = [];

  constructor(
    private classService: ClassService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadClasses();
    this.loadCourses();
  }

  loadClasses() {
    this.classService.getClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (error) => console.error('Error loading classes:', error)
    });
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course?.name || 'Unknown Course';
  }
}

