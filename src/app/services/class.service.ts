import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Class } from '../models/class.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private supabaseService: SupabaseService) {}

  getClasses(courseId?: string): Observable<Class[]> {
    let query = this.supabaseService.client
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    return from(query).pipe(map((result: any) => result.data || []));
  }

  getClass(id: string): Observable<Class> {
    return from(
      this.supabaseService.client
        .from('classes')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(map((result: any) => result.data));
  }

  createClass(classData: Partial<Class>): Observable<Class> {
    return from(
      this.supabaseService.client
        .from('classes')
        .insert(classData)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  updateClass(id: string, classData: Partial<Class>): Observable<Class> {
    return from(
      this.supabaseService.client
        .from('classes')
        .update(classData)
        .eq('id', id)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  deleteClass(id: string): Observable<void> {
    return from(
      this.supabaseService.client
        .from('classes')
        .delete()
        .eq('id', id)
    ).pipe(map(() => undefined));
  }
}

