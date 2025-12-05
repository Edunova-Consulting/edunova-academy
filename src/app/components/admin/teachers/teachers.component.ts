import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../models/teacher.model';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  showForm: boolean = false;
  editingTeacher: Teacher | null = null;
  formData: Partial<Teacher> = {
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  };
  password: string = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => this.teachers = teachers,
      error: (error) => console.error('Error loading teachers:', error)
    });
  }

  openCreateForm() {
    this.editingTeacher = null;
    this.formData = { email: '', first_name: '', last_name: '', phone: '' };
    this.password = '';
    this.showForm = true;
  }

  openEditForm(teacher: Teacher) {
    this.editingTeacher = teacher;
    this.formData = { ...teacher };
    delete (this.formData as any).password;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingTeacher = null;
    this.formData = { email: '', first_name: '', last_name: '', phone: '' };
    this.password = '';
  }

  saveTeacher() {
    if (this.editingTeacher) {
      this.teacherService.updateTeacher(this.editingTeacher.id, this.formData).subscribe({
        next: () => {
          this.loadTeachers();
          this.closeForm();
        },
        error: (error) => console.error('Error updating teacher:', error)
      });
    } else {
      // For new teachers, we need to create auth user first
      // This would typically be handled by the backend
      this.teacherService.createTeacher(this.formData).subscribe({
        next: () => {
          this.loadTeachers();
          this.closeForm();
        },
        error: (error) => console.error('Error creating teacher:', error)
      });
    }
  }

  deleteTeacher(id: string) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.deleteTeacher(id).subscribe({
        next: () => this.loadTeachers(),
        error: (error) => console.error('Error deleting teacher:', error)
      });
    }
  }
}

