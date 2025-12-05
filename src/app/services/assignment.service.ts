import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Assignment, StudentAssignment } from '../models/assignment.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  constructor(private supabaseService: SupabaseService) {}

  getAssignments(courseId?: string): Observable<Assignment[]> {
    let query = this.supabaseService.client
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    return from(query).pipe(map((result: any) => result.data || []));
  }

  getAssignment(id: string): Observable<Assignment> {
    return from(
      this.supabaseService.client
        .from('assignments')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(map((result: any) => result.data));
  }

  createAssignment(assignment: Partial<Assignment>): Observable<Assignment> {
    return from(
      this.supabaseService.client
        .from('assignments')
        .insert(assignment)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  updateAssignment(id: string, assignment: Partial<Assignment>): Observable<Assignment> {
    return from(
      this.supabaseService.client
        .from('assignments')
        .update(assignment)
        .eq('id', id)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  deleteAssignment(id: string): Observable<void> {
    return from(
      this.supabaseService.client
        .from('assignments')
        .delete()
        .eq('id', id)
    ).pipe(map(() => undefined));
  }

  getStudentAssignments(assignmentId?: string, studentId?: string): Observable<StudentAssignment[]> {
    let query = this.supabaseService.client
      .from('student_assignments')
      .select('*');

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }
    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    return from(query.order('created_at', { ascending: false })).pipe(map((result: any) => result.data || []));
  }

  updateStudentAssignment(id: string, assignment: Partial<StudentAssignment>): Observable<StudentAssignment> {
    return from(
      this.supabaseService.client
        .from('student_assignments')
        .update(assignment)
        .eq('id', id)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }
}

