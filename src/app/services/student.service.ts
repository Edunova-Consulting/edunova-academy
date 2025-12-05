import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Student } from '../models/student.model';
import { UserRole } from '../models/user.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private supabaseService: SupabaseService) {}

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

  createStudent(student: Partial<Student>): Observable<Student> {
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
  }

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

