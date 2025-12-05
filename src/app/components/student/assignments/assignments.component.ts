import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment.service';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Assignment, StudentAssignment } from '../../../models/assignment.model';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class StudentAssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  studentAssignments: StudentAssignment[] = [];
  courses: Course[] = [];
  showForm: boolean = false;
  selectedAssignment: Assignment | null = null;
  formData: Partial<StudentAssignment> = {
    status: 'submitted'
  };

  constructor(
    private assignmentService: AssignmentService,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAssignments();
    this.loadCourses();
    this.loadStudentAssignments();
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

  loadStudentAssignments() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.assignmentService.getStudentAssignments(undefined, user.id).subscribe({
        next: (assignments) => this.studentAssignments = assignments,
        error: (error) => console.error('Error loading student assignments:', error)
      });
    }
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course?.name || 'Unknown Course';
  }

  getStudentAssignment(assignmentId: string): StudentAssignment | undefined {
    return this.studentAssignments.find(sa => sa.assignment_id === assignmentId);
  }

  openUpdateForm(assignment: Assignment) {
    this.selectedAssignment = assignment;
    const studentAssignment = this.getStudentAssignment(assignment.id);
    if (studentAssignment) {
      this.formData = { ...studentAssignment };
    } else {
      const user = this.authService.getCurrentUser();
      this.formData = {
        assignment_id: assignment.id,
        student_id: user?.id,
        status: 'submitted'
      };
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.selectedAssignment = null;
    this.formData = { status: 'submitted' };
  }

  saveAssignment() {
    const studentAssignment = this.getStudentAssignment(this.selectedAssignment!.id);
    if (studentAssignment) {
      this.assignmentService.updateStudentAssignment(studentAssignment.id, this.formData).subscribe({
        next: () => {
          this.loadStudentAssignments();
          this.closeForm();
        },
        error: (error) => console.error('Error updating assignment:', error)
      });
    }
  }
}

