import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'supplier' | 'builder' | 'admin' | 'delivery_provider';

export interface DeliveryUser {
  id: string;
  email: string;
  profile?: {
    id: string;
    role: UserRole;
    full_name?: string;
    company_name?: string;
    business_license?: string;
  };
}

export const useDeliveryAuth = () => {
  const [user, setUser] = useState<DeliveryUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        await fetchUserProfile(authUser);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: "Authentication Error",
        description: "Unable to verify your login status. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (authUser: any) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, full_name, company_name, business_license')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast({
          title: "Profile Error",
          description: "Could not load your profile information.",
          variant: "destructive",
        });
        return;
      }

      const deliveryUser: DeliveryUser = {
        id: authUser.id,
        email: authUser.email || '',
        profile: profileData ? {
          id: profileData.id,
          role: profileData.role as UserRole,
          full_name: profileData.full_name || undefined,
          company_name: profileData.company_name || undefined,
          business_license: profileData.business_license || undefined
        } : undefined
      };

      setUser(deliveryUser);
      setUserRole((profileData?.role as UserRole) || null);
      setAuthenticated(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile.",
        variant: "destructive",
      });
    }
  };

  const requireAuth = (callback: () => void) => {
    if (!authenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature.",
        variant: "destructive",
      });
      // Redirect to auth page
      window.location.href = '/auth';
      return;
    }
    callback();
  };

  const requireRole = (requiredRole: UserRole | UserRole[], callback: () => void) => {
    if (!authenticated || !user || !userRole) {
      requireAuth(callback);
      return;
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(userRole)) {
      toast({
        title: "Access Denied",
        description: `This feature requires ${roles.join(' or ')} access.`,
        variant: "destructive",
      });
      return;
    }

    callback();
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(userRole);
  };

  return {
    user,
    userRole,
    loading,
    authenticated,
    requireAuth,
    requireRole,
    hasRole,
    refresh: checkAuth
  };
};