-- Fix infinite recursion in RLS policies by creating security definer functions

-- 1. Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 2. Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. Create security definer function to check if user is builder
CREATE OR REPLACE FUNCTION public.is_builder()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'builder'
  );
$$;

-- 4. Create security definer function to check if user is supplier
CREATE OR REPLACE FUNCTION public.is_supplier()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'supplier'
  );
$$;

-- 5. Create security definer function to get user profile id
CREATE OR REPLACE FUNCTION public.get_current_user_profile_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 6. Drop and recreate problematic policies on profiles table to fix recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new non-recursive policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own profile" 
ON profiles FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service accounts can manage profiles" 
ON profiles FOR ALL 
USING (auth.role() = 'service_role');

-- 7. Update any other policies that might be causing recursion
-- Fix suppliers table policies to use new functions
DROP POLICY IF EXISTS "Verified suppliers are publicly visible" ON suppliers;

CREATE POLICY "Verified suppliers are publicly visible" 
ON suppliers FOR SELECT 
USING (is_verified = true OR public.is_admin() OR public.is_supplier());

-- 8. Make sure suppliers table allows public read access for basic info
CREATE POLICY "Public can view basic supplier info" 
ON suppliers FOR SELECT 
USING (true);