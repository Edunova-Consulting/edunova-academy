import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../../services/class.service';
import { CourseService } from '../../../services/course.service';
import { Class } from '../../../models/class.model';
import { Course } from '../../../models/course.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class TeacherClassesComponent implements OnInit {
  classes: Class[] = [];
  courses: Course[] = [];
  showForm: boolean = false;
  editingClass: Class | null = null;
  formData: Partial<Class> = {
    course_id: '',
    name: '',
    description: '',
    scheduled_date: ''
  };

  constructor(
    private classService: ClassService,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadClasses();
  }

  loadClasses() {
    // Teachers can only see classes from courses they're assigned to
    // For now, load all classes - you may want to filter by teacher's courses
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

  openCreateForm() {
    this.editingClass = null;
    this.formData = { course_id: '', name: '', description: '', scheduled_date: '' };
    this.showForm = true;
  }

  openEditForm(classItem: Class) {
    this.editingClass = classItem;
    this.formData = { ...classItem };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingClass = null;
    this.formData = { course_id: '', name: '', description: '', scheduled_date: '' };
  }

  saveClass() {
    if (this.editingClass) {
      this.classService.updateClass(this.editingClass.id, this.formData).subscribe({
        next: () => {
          this.loadClasses();
          this.closeForm();
        },
        error: (error) => console.error('Error updating class:', error)
      });
    } else {
      this.classService.createClass(this.formData).subscribe({
        next: () => {
          this.loadClasses();
          this.closeForm();
        },
        error: (error) => console.error('Error creating class:', error)
      });
    }
  }

  deleteClass(id: string) {
    if (confirm('Are you sure you want to delete this class?')) {
      this.classService.deleteClass(id).subscribe({
        next: () => this.loadClasses(),
        error: (error) => console.error('Error deleting class:', error)
      });
    }
  }
}

