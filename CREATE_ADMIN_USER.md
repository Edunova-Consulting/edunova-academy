# Create Initial Admin User Guide

This guide explains how to create your first admin user in Supabase Auth and link it to the `users` table with the 'Admin' role.

## Prerequisites

- Supabase project is set up
- Database schema has been created (run `supabase-schema.sql`)
- You have access to Supabase Dashboard

## Method 1: Using Supabase Dashboard (Recommended)

This is the easiest method for creating your first admin user.

### Step 1: Create User in Supabase Auth

1. Go to your Supabase project: https://rmpkbptnsnmpamxrlojh.supabase.co
2. Navigate to **Authentication** → **Users** in the left sidebar
3. Click **Add User** → **Create New User**
4. Fill in the form:
   - **Email**: Enter your admin email (e.g., `admin@edunova.com`)
   - **Password**: Enter a strong password
   - **Auto Confirm User**: ✅ Check this box (so user can login immediately)
   - **Send Invite Email**: Optional (uncheck if you don't want to send email)
5. Click **Create User**

### Step 2: Link User to Users Table with Admin Role

1. Go to **SQL Editor** → **New Query**
2. Copy and paste this SQL (replace the email with your admin email):

```sql
UPDATE public.users
SET role = 'Admin'
WHERE email = 'your-admin-email@example.com';
```

3. Click **Run**

### Step 3: Verify Admin User

Run this query to verify:

```sql
SELECT id, email, role, first_name, last_name, created_at
FROM public.users
WHERE email = 'your-admin-email@example.com';
```

You should see `role = 'Admin'`.

## Method 2: Using SQL Script

If you prefer to do everything via SQL:

### Step 1: Create Auth User (via Supabase Auth UI)

You still need to create the auth user via the UI first (see Method 1, Step 1).

### Step 2: Get User UUID

1. Go to **Authentication** → **Users**
2. Find your user and copy the **UUID** (it's in the user details)

### Step 3: Create Profile with Admin Role

1. Go to **SQL Editor**
2. Run this SQL (replace values):

```sql
INSERT INTO public.users (id, email, role, first_name, last_name)
VALUES (
    'paste-user-uuid-here',
    'admin@example.com',
    'Admin',
    'Admin',
    'User'
)
ON CONFLICT (id) DO UPDATE
SET role = 'Admin';
```

## Method 3: Automatic First User as Admin

If you want the first user created to automatically become Admin:

1. Create your user via Supabase Auth UI (Method 1, Step 1)
2. Go to **SQL Editor**
3. Run this from `supabase-create-admin.sql`:

```sql
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    SELECT id INTO first_user_id
    FROM public.users
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        UPDATE public.users
        SET role = 'Admin'
        WHERE id = first_user_id;
    END IF;
END $$;
```

## Troubleshooting

### Issue: User profile not created automatically

**Solution**: The `handle_new_user()` trigger should create profiles automatically. If it didn't:

1. Check if the trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. If missing, the trigger is in `supabase-schema.sql` - re-run that section.

3. Manually create the profile:
```sql
INSERT INTO public.users (id, email, role)
SELECT id, email, 'Student'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
LIMIT 1;
```

Then update to Admin:
```sql
UPDATE public.users SET role = 'Admin' WHERE email = 'your-email@example.com';
```

### Issue: "User already exists" error

**Solution**: The user profile already exists. Just update the role:

```sql
UPDATE public.users
SET role = 'Admin'
WHERE email = 'your-email@example.com';
```

### Issue: Cannot login after creating admin

**Solution**: 
1. Verify user exists in `auth.users`:
```sql
SELECT id, email, confirmed_at FROM auth.users WHERE email = 'your-email@example.com';
```

2. If `confirmed_at` is NULL, confirm the user:
   - Go to **Authentication** → **Users**
   - Find your user
   - Click the three dots → **Confirm User**

### Issue: Role not updating

**Solution**: 
1. Check if RLS policies allow the update
2. Run as superuser or disable RLS temporarily:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
UPDATE public.users SET role = 'Admin' WHERE email = 'your-email@example.com';
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Verification Checklist

After creating your admin user, verify:

- [ ] User exists in `auth.users` table
- [ ] User profile exists in `public.users` table
- [ ] Role is set to 'Admin' in `public.users`
- [ ] User can login via the application
- [ ] User has access to admin routes and features
- [ ] User can create/edit/delete courses, classes, assignments
- [ ] User can manage teachers and students

## Test Admin Access

1. **Login Test**: Try logging in with your admin credentials
2. **Dashboard Test**: You should see all admin navigation items
3. **CRUD Test**: Try creating a course, class, or assignment
4. **User Management Test**: Try creating a teacher or student

## Security Notes

- **Strong Password**: Use a strong, unique password for your admin account
- **Email Verification**: Consider enabling email verification for production
- **2FA**: Enable two-factor authentication for admin accounts in production
- **Limit Admin Users**: Only create admin users for trusted personnel
- **Audit Log**: Keep track of who has admin access

## Next Steps

After creating your admin user:

1. ✅ Test login functionality
2. ✅ Create test data (courses, classes, assignments)
3. ✅ Create test users with different roles (Teacher, Student)
4. ✅ Test role-based access control
5. ✅ Verify all CRUD operations work correctly

## Quick Reference

**Update existing user to Admin:**
```sql
UPDATE public.users SET role = 'Admin' WHERE email = 'your-email@example.com';
```

**Check all admin users:**
```sql
SELECT id, email, role, created_at FROM public.users WHERE role = 'Admin';
```

**Remove admin role:**
```sql
UPDATE public.users SET role = 'Student' WHERE email = 'your-email@example.com';
```

