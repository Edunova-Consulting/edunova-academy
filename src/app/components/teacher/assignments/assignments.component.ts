import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment.service';
import { CourseService } from '../../../services/course.service';
import { Assignment } from '../../../models/assignment.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-teacher-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class TeacherAssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  courses: Course[] = [];
  showForm: boolean = false;
  editingAssignment: Assignment | null = null;
  formData: Partial<Assignment> = {
    course_id: '',
    title: '',
    description: '',
    due_date: '',
    max_score: 100
  };

  constructor(
    private assignmentService: AssignmentService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadAssignments();
    this.loadCourses();
  }

  loadAssignments() {
    this.assignmentService.getAssignments().subscribe({
      next: (assignments) => this.assignments = assignments,
      error: (error) => console.error('Error loading assignments:', error)
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
    this.editingAssignment = null;
    this.formData = { course_id: '', title: '', description: '', due_date: '', max_score: 100 };
    this.showForm = true;
  }

  openEditForm(assignment: Assignment) {
    this.editingAssignment = assignment;
    this.formData = { ...assignment };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingAssignment = null;
    this.formData = { course_id: '', title: '', description: '', due_date: '', max_score: 100 };
  }

  saveAssignment() {
    if (this.editingAssignment) {
      this.assignmentService.updateAssignment(this.editingAssignment.id, this.formData).subscribe({
        next: () => {
          this.loadAssignments();
          this.closeForm();
        },
        error: (error) => console.error('Error updating assignment:', error)
      });
    } else {
      this.assignmentService.createAssignment(this.formData).subscribe({
        next: () => {
          this.loadAssignments();
          this.closeForm();
        },
        error: (error) => console.error('Error creating assignment:', error)
      });
    }
  }

  deleteAssignment(id: string) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignmentService.deleteAssignment(id).subscribe({
        next: () => this.loadAssignments(),
        error: (error) => console.error('Error deleting assignment:', error)
      });
    }
  }
}

