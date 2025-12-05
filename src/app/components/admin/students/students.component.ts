import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  showForm: boolean = false;
  editingStudent: Student | null = null;
  formData: Partial<Student> = {
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    enrollment_date: ''
  };
  password: string = '';

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (students) => this.students = students,
      error: (error) => console.error('Error loading students:', error)
    });
  }

  openCreateForm() {
    this.editingStudent = null;
    this.formData = { email: '', first_name: '', last_name: '', phone: '', enrollment_date: '' };
    this.password = '';
    this.showForm = true;
  }

  openEditForm(student: Student) {
    this.editingStudent = student;
    this.formData = { ...student };
    delete (this.formData as any).password;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingStudent = null;
    this.formData = { email: '', first_name: '', last_name: '', phone: '', enrollment_date: '' };
    this.password = '';
  }

  async saveStudent(){
    try{
      if(this.editingStudent){
        await this.studentService.updateStudent(this.editingStudent.id, this.formData).toPromise();
        console.log('Student updated successfully');
      }
      else{
        //Nuevo estudiante: necesitamos password
        const password = this.password;
        const newStudent = await this.studentService.createStudent(this.formData, password);
        console.log('Student created successfully:', newStudent);
      }

      this.loadStudents();
      this.closeForm();

    } catch(error:any){
      console.error('Error saving student:', error);
    }
  }

  /*saveStudent() {
    if (this.editingStudent) {
      this.studentService.updateStudent(this.editingStudent.id, this.formData).subscribe({
        next: () => {
          this.loadStudents();
          this.closeForm();
        },
        error: (error) => console.error('Error updating student:', error)
      });
    } else {
      this.studentService.createStudent(this.formData,).subscribe({
        next: () => {
          this.loadStudents();
          this.closeForm();
        },
        error: (error) => console.error('Error creating student:', error)
      });
    }
  }*/

  deleteStudent(id: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => this.loadStudents(),
        error: (error) => console.error('Error deleting student:', error)
      });
    }
  }
}

