# Row Level Security (RLS) Setup Guide

This guide explains how to enable and verify Row Level Security policies in Supabase for role-based access control.

## What is Row Level Security (RLS)?

Row Level Security is a PostgreSQL feature that restricts which rows users can see and modify based on policies you define. In Supabase, RLS ensures that:

- **Admins** have full CRUD access to all resources
- **Teachers** can manage classes, assignments, and student enrollments
- **Students** can only read courses/classes and update their own assignments

## Quick Setup

### Option 1: If you haven't run the main schema yet

If you haven't created the tables yet, simply run `supabase-schema.sql` - it includes all RLS policies.

### Option 2: If tables already exist

If your tables already exist but RLS is not enabled, run `supabase-enable-rls.sql` to:
1. Enable RLS on all tables
2. Create all necessary policies

## Step-by-Step Instructions

### Step 1: Enable RLS

1. Go to your Supabase project: https://rmpkbptnsnmpamxrlojh.supabase.co
2. Navigate to **SQL Editor** → **New Query**
3. Copy and paste the contents of `supabase-enable-rls.sql`
4. Click **Run**

This will:
- Enable RLS on all 7 tables
- Drop any existing policies (for clean reinstall)
- Create all role-based policies

### Step 2: Verify RLS is Enabled

1. In the SQL Editor, run `supabase-verify-rls.sql`
2. Check the results:
   - All tables should show `rls_enabled = true`
   - Each table should have the expected number of policies:
     - `users`: 6 policies
     - `courses`: 4 policies
     - `classes`: 4 policies
     - `assignments`: 4 policies
     - `course_teachers`: 3 policies
     - `course_students`: 3 policies
     - `student_assignments`: 3 policies

### Step 3: Test Policies

Test that policies work correctly:

```sql
-- Test as Admin (replace with your admin user ID)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = 'your-admin-user-id';

-- Should return all courses
SELECT * FROM public.courses;

-- Test as Student (replace with a student user ID)
SET LOCAL request.jwt.claim.sub = 'your-student-user-id';

-- Should return all courses (read-only for students)
SELECT * FROM public.courses;

-- Should fail (students can't insert courses)
INSERT INTO public.courses (name, description) VALUES ('Test', 'Test');
```

## Policy Summary

### Users Table
- ✅ Users can view/update their own profile
- ✅ Admins can view/insert/update/delete all users

### Courses Table
- ✅ Everyone can read courses
- ✅ Only admins can create/update/delete courses

### Classes Table
- ✅ Everyone can read classes
- ✅ Admins and Teachers can create/update/delete classes

### Assignments Table
- ✅ Everyone can read assignments
- ✅ Admins and Teachers can create/update assignments
- ✅ Only admins can delete assignments

### Course Teachers Table
- ✅ Everyone can view course-teacher relationships
- ✅ Only admins can assign/remove teachers from courses

### Course Students Table
- ✅ Everyone can view course-student relationships
- ✅ Admins and Teachers can assign/remove students from courses

### Student Assignments Table
- ✅ Students can view/insert/update their own assignments
- ✅ Admins and Teachers can view/insert/update all assignments

## Troubleshooting

### Issue: "Permission denied" errors

**Solution**: 
1. Verify RLS is enabled: Run `supabase-verify-rls.sql`
2. Check user role: `SELECT role FROM public.users WHERE id = auth.uid();`
3. Ensure policies are created: Check the policy count in verification query

### Issue: Policies not working

**Solution**:
1. Make sure you're authenticated: `SELECT auth.uid();` should return your user ID
2. Verify your user exists in `public.users` table with correct role
3. Check policy conditions match your requirements

### Issue: Can't insert/update/delete

**Solution**:
1. Check if RLS is enabled: `SELECT rowsecurity FROM pg_tables WHERE tablename = 'your_table';`
2. Verify your role has the required permissions
3. Check policy conditions in `pg_policies` view

## Security Best Practices

1. **Always enable RLS** on tables containing sensitive data
2. **Test policies** with different user roles before deploying
3. **Use least privilege principle** - only grant minimum necessary permissions
4. **Regular audits** - periodically review and verify policies
5. **Monitor access** - use Supabase logs to track policy violations

## Policy Maintenance

### Adding New Policies

If you need to add custom policies:

```sql
CREATE POLICY "your_policy_name"
    ON public.your_table
    FOR SELECT  -- or INSERT, UPDATE, DELETE
    USING (your_condition_here);
```

### Modifying Existing Policies

To modify a policy, drop and recreate it:

```sql
DROP POLICY IF EXISTS "policy_name" ON public.table_name;
CREATE POLICY "policy_name" ...;
```

### Disabling RLS (Not Recommended)

Only disable RLS for testing or migration purposes:

```sql
ALTER TABLE public.table_name DISABLE ROW LEVEL SECURITY;
```

## Verification Checklist

- [ ] RLS enabled on all 7 tables
- [ ] 27 total policies created
- [ ] Admin user can perform all operations
- [ ] Teacher user can manage classes/assignments
- [ ] Student user can only read and update own assignments
- [ ] Policies tested with different user roles

## Next Steps

After enabling RLS:

1. Test authentication flow
2. Create test users with different roles
3. Verify each role can only access permitted resources
4. Monitor Supabase logs for any policy violations
5. Document any custom policies you add

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Policy Examples](https://supabase.com/docs/guides/auth/row-level-security#policy-examples)

