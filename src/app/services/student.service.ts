import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Student } from '../models/student.model';
import { UserRole } from '../models/user.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  getStudents(): Observable<Student[]> {
    return from(
      this.supabaseService.client
        .from('users')
        .select('*')
        .eq('role', UserRole.Student)
        .order('created_at', { ascending: false })
    ).pipe(map((result: any) => result.data || []));
  }

  getStudent(id: string): Observable<Student> {
    return from(
      this.supabaseService.client
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', UserRole.Student)
        .single()
    ).pipe(map((result: any) => result.data));
  }

  async createStudent(student: Partial<Student>, password: string): Promise<Student>{
    //Crear usuario en Auth
    const { error } = await this.authService.signUp(
      student.email!,
      password,
      UserRole.Student,
      {
        first_name: student.first_name,
        last_name: student.last_name,
        phone: student.phone,
        enrollment_date: student.enrollment_date
      }
    );
    
    if (error) throw error;

    //recuperar perfil creado
    const newStudent = await this.authService.getCurrentUser();
    return newStudent as Student;
  }

  /*createStudent(student: Partial<Student>): Observable<Student> {
    const studentData = {
      ...student,
      role: UserRole.Student
    };
    return from(
      this.supabaseService.client
        .from('users')
        .insert(studentData)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }*/

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    return from(
      this.supabaseService.client
        .from('users')
        .update(student)
        .eq('id', id)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  deleteStudent(id: string): Observable<void> {
    return from(
      this.supabaseService.client
        .from('users')
        .delete()
        .eq('id', id)
    ).pipe(map(() => undefined));
  }
}

