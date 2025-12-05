import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Course, CourseTeacher, CourseStudent } from '../models/course.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private supabaseService: SupabaseService) {}

  getCourses(): Observable<Course[]> {
    return from(
      this.supabaseService.client
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(map((result: any) => result.data || []));
  }

  getCourse(id: string): Observable<Course> {
    return from(
      this.supabaseService.client
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(map((result: any) => result.data));
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return from(
      this.supabaseService.client
        .from('courses')
        .insert(course)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return from(
      this.supabaseService.client
        .from('courses')
        .update(course)
        .eq('id', id)
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  deleteCourse(id: string): Observable<void> {
    return from(
      this.supabaseService.client
        .from('courses')
        .delete()
        .eq('id', id)
    ).pipe(map(() => undefined));
  }

  assignTeacherToCourse(courseId: string, teacherId: string): Observable<CourseTeacher> {
    return from(
      this.supabaseService.client
        .from('course_teachers')
        .insert({ course_id: courseId, teacher_id: teacherId })
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  assignStudentToCourse(courseId: string, studentId: string): Observable<CourseStudent> {
    return from(
      this.supabaseService.client
        .from('course_students')
        .insert({ course_id: courseId, student_id: studentId })
        .select()
        .single()
    ).pipe(map((result: any) => result.data));
  }

  getCourseTeachers(courseId: string): Observable<any[]> {
    return from(
      this.supabaseService.client
        .from('course_teachers')
        .select('*, teachers:teacher_id(*)')
        .eq('course_id', courseId)
    ).pipe(map((result: any) => result.data || []));
  }

  getCourseStudents(courseId: string): Observable<any[]> {
    return from(
      this.supabaseService.client
        .from('course_students')
        .select('*, students:student_id(*)')
        .eq('course_id', courseId)
    ).pipe(map((result: any) => result.data || []));
  }
}

