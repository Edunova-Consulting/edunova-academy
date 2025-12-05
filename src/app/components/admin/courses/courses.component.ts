import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  showForm: boolean = false;
  editingCourse: Course | null = null;
  formData: Partial<Course> = {
    name: '',
    description: ''
  };

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  openCreateForm() {
    this.editingCourse = null;
    this.formData = { name: '', description: '' };
    this.showForm = true;
  }

  openEditForm(course: Course) {
    this.editingCourse = course;
    this.formData = { ...course };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingCourse = null;
    this.formData = { name: '', description: '' };
  }

  saveCourse() {
    if (this.editingCourse) {
      this.courseService.updateCourse(this.editingCourse.id, this.formData).subscribe({
        next: () => {
          this.loadCourses();
          this.closeForm();
        },
        error: (error) => console.error('Error updating course:', error)
      });
    } else {
      this.courseService.createCourse(this.formData).subscribe({
        next: () => {
          this.loadCourses();
          this.closeForm();
        },
        error: (error) => console.error('Error creating course:', error)
      });
    }
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => this.loadCourses(),
        error: (error) => console.error('Error deleting course:', error)
      });
    }
  }
}

