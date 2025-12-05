import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Teacher } from '../models/teacher.model';
import { UserRole } from '../models/user.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  constructor(private supabaseService: SupabaseService) {}

  getTeachers(): Observable<Teacher[]> {
    return from(
      this.supabaseService.client
        .from('users')
        .select('*')
        .eq('role', UserRole.Teacher)
        .order('created_at', { ascending: false })
    ).pipe(map((result: any) => result.data || []));
  }

  getTeacher(id: string): Observable<Teacher> {
    return from(
      this.supabaseService.client
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', UserRole.Teacher)
        .single()
    ).pipe(map((result: any) => result.data));
  }

  createTeacher(teacher: Partial<Teacher>): Observable<Teacher> {
    const teacherData = {
      ...teacher,
      role: UserRole.Teacher
    };
    return from(
      this.supabaseService.client
        .from('users')
        .insert(teacherData)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<Teacher> {
    return from(
      this.supabaseService.client
        .from('users')
        .update(teacher)
        .eq('id', id)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  deleteTeacher(id: string): Observable<void> {
    return from(
      this.supabaseService.client
        .from('users')
        .delete()
        .eq('id', id)
    ).pipe(map(() => undefined));
  }
}

