import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User, UserRole } from '../models/user.model';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal<boolean>(false);

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.checkSession();
  }

  async checkSession() {
    try {
      const { data: { session } } = await this.supabaseService.client.auth.getSession();
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

  async signIn(email: string, password: string): Promise<{ error: any }> {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data.user) {
      await this.loadUserProfile(data.user.id);
    }

    return { error };
  }

  async signUp(email: string, password: string, role: UserRole, additionalData?: any): Promise<{ error: any }> {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password
    });

    if (!error && data.user) {
      // Create user profile with role
      const { error: profileError } = await this.supabaseService.client
        .from('users')
        .insert({
          id: data.user.id,
          email,
          role,
          ...additionalData
        });

      if (!profileError) {
        await this.loadUserProfile(data.user.id);
      }

      return { error: profileError };
    }

    return { error };
  }

  async signOut(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private async loadUserProfile(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.currentUserSubject.next(data as User);
      this.isAuthenticated.set(true);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.Admin);
  }

  isTeacher(): boolean {
    return this.hasRole(UserRole.Teacher);
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.Student);
  }
}

