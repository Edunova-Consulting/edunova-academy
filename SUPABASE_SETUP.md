# Supabase Database Setup Guide

This guide will help you set up the database schema for the Edunova Academy application.

## Prerequisites

1. Access to your Supabase project dashboard
2. SQL Editor access in Supabase

## Setup Steps

### Step 1: Run the Schema SQL

1. Go to your Supabase project dashboard: https://rmpkbptnsnmpamxrlojh.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- All necessary tables
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamp updates
- A function to automatically create user profiles on signup

### Step 2: Verify Tables Were Created

1. Go to **Table Editor** in Supabase
2. You should see the following tables:
   - `users`
   - `courses`
   - `classes`
   - `assignments`
   - `course_teachers`
   - `course_students`
   - `student_assignments`

### Step 3: Create Your First Admin User

#### Option A: Using Supabase Dashboard

1. Go to **Authentication** > **Users** in Supabase
2. Click **Add User** > **Create New User**
3. Enter an email and password
4. After creating the user, note the user's UUID

5. Go to **SQL Editor** and run:
```sql
UPDATE public.users
SET role = 'Admin'
WHERE email = 'your-admin-email@example.com';
```

#### Option B: Using SQL (if you already have a user)

```sql
-- First, create the user in auth.users (or use Supabase Auth UI)
-- Then update their role
UPDATE public.users
SET role = 'Admin'
WHERE email = 'your-admin-email@example.com';
```

### Step 4: Test the Setup

1. Try logging in with your admin account
2. You should be able to access all admin features
3. Create a test course, class, or assignment to verify everything works

## Database Schema Overview

### Tables

1. **users** - User profiles with roles (Admin, Teacher, Student)
2. **courses** - Course information
3. **classes** - Class sessions for courses
4. **assignments** - Assignments for courses
5. **course_teachers** - Many-to-many relationship between courses and teachers
6. **course_students** - Many-to-many relationship between courses and students
7. **student_assignments** - Student submissions and grades for assignments

### Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:
- **Admins**: Full access to all resources
- **Teachers**: Can manage classes, assignments, and student enrollments
- **Students**: Can read courses/classes and update their own assignments

### Important Notes

1. **Default Role**: New users are automatically assigned the 'Student' role. Only admins can change roles.

2. **User Profile Creation**: The `handle_new_user()` function automatically creates a user profile in the `users` table when someone signs up via Supabase Auth.

3. **Cascade Deletes**: Deleting a course will automatically delete associated classes, assignments, and relationships.

4. **Unique Constraints**: 
   - Each teacher can only be assigned to a course once
   - Each student can only be enrolled in a course once
   - Each student can only have one submission per assignment

## Troubleshooting

### Issue: "Permission denied" errors

**Solution**: Make sure RLS policies are correctly set up. Check that:
- RLS is enabled on all tables
- Your user has the correct role in the `users` table
- Policies match your user's role

### Issue: User profile not created on signup

**Solution**: 
1. Check that the `handle_new_user()` function exists
2. Verify the trigger `on_auth_user_created` is active
3. Manually create the user profile if needed:
```sql
INSERT INTO public.users (id, email, role)
VALUES ('user-uuid-here', 'user@example.com', 'Student');
```

### Issue: Cannot insert/update/delete

**Solution**: Verify your user's role:
```sql
SELECT id, email, role FROM public.users WHERE id = auth.uid();
```

## Next Steps

After setting up the database:

1. Test authentication by logging in
2. Create test data (courses, classes, assignments)
3. Test role-based access with different user types
4. Set up additional users with different roles for testing

## Security Considerations

- All tables use Row Level Security (RLS)
- Policies are role-based and enforce proper access control
- Foreign key constraints ensure data integrity
- Unique constraints prevent duplicate relationships

For production, consider:
- Adding additional validation rules
- Setting up database backups
- Monitoring query performance
- Reviewing and adjusting RLS policies as needed

