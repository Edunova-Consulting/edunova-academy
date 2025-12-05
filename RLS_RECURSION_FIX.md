# Fix RLS Infinite Recursion Error

## Problem

When logging in, you get this error:
```
ERROR 500 Internal server error
"code": "42P17",
"message": "infinite recursion detected in policy for relation \"users\""
```

## Root Cause

The RLS policies on the `users` table were checking if a user is an admin by querying the `users` table itself:

```sql
EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'Admin'
)
```

This creates infinite recursion:
1. Policy checks if user is admin → queries `users` table
2. Querying `users` table triggers the same policy check
3. Policy checks again → queries `users` table again
4. Infinite loop!

## Solution

Use **Security Definer functions** that bypass RLS to check user roles without recursion.

## Quick Fix

1. Go to your Supabase SQL Editor
2. Run `supabase-fix-rls-recursion.sql`
3. Try logging in again

## What the Fix Does

1. **Creates helper functions**:
   - `get_user_role(user_id)` - Gets user role without triggering RLS
   - `is_admin(user_id)` - Checks if user is admin without triggering RLS

2. **Updates all policies** to use these functions instead of direct queries

3. **Fixes all tables** that reference the users table:
   - `users` table policies
   - `classes` table policies
   - `assignments` table policies
   - `course_teachers` table policies
   - `course_students` table policies
   - `student_assignments` table policies

## Security Note

The `SECURITY DEFINER` functions run with elevated privileges but are safe because:
- They only read data, don't modify it
- They're used only in policy checks
- They're restricted to the `public` schema

## Verification

After running the fix, test:

1. **Login as admin** - should work without errors
2. **View users list** - should show all users
3. **Create a course** - should work
4. **Check browser console** - no 500 errors

## Alternative: Simpler Policies (If Functions Don't Work)

If you still have issues, you can use simpler policies that don't check roles:

```sql
-- Allow all authenticated users to read users table
CREATE POLICY "Authenticated users can view users"
    ON public.users FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only allow admins to modify (check in application layer)
CREATE POLICY "Admins can modify users"
    ON public.users FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM public.users WHERE role = 'Admin'
    ));
```

However, the function-based approach is more secure and recommended.

## Troubleshooting

### Still getting recursion errors?

1. Check if functions exist:
```sql
SELECT proname FROM pg_proc WHERE proname IN ('get_user_role', 'is_admin');
```

2. Verify functions are security definer:
```sql
SELECT proname, prosecdef FROM pg_proc WHERE proname IN ('get_user_role', 'is_admin');
-- Should return 't' (true) for prosecdef
```

3. Test the function directly:
```sql
SELECT public.get_user_role(auth.uid());
SELECT public.is_admin(auth.uid());
```

### Functions not working?

Make sure you ran the entire `supabase-fix-rls-recursion.sql` script, not just parts of it.

### Still can't login?

1. Temporarily disable RLS to test:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- Test login
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

2. Check if user exists and has correct role:
```sql
SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';
```

## Prevention

When creating RLS policies:
- ✅ Use security definer functions for role checks
- ✅ Avoid querying the same table in policy conditions
- ✅ Test policies with different user roles
- ❌ Don't query the table being protected in its own policies

