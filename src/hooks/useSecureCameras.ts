import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SafeCameraData {
  id: string;
  name: string;
  general_location: string;
  project_id?: string;
  is_active: boolean;
  can_request_access: boolean;
  access_requirements: string;
}

interface SecureCameraAccess {
  camera_id: string;
  camera_name: string;
  can_access_stream: boolean;
  stream_url?: string;
  access_message: string;
  access_level: string;
}

interface UseSecureCamerasResult {
  cameras: SafeCameraData[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  requestCameraAccess: (cameraId: string) => Promise<SecureCameraAccess | null>;
  logCameraAccess: (cameraId: string, accessType: string) => Promise<void>;
}

export const useSecureCameras = (): UseSecureCamerasResult => {
  const [cameras, setCameras] = useState<SafeCameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchCameras = async () => {
      try {
        setLoading(true);
        
        // Check authentication status
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          setUserRole(profile?.role || null);
        }

        // Fetch safe camera directory using secure function
        const { data, error: fetchError } = await supabase
          .rpc('get_safe_camera_directory');

        if (fetchError) {
          throw fetchError;
        }

        setCameras(data || []);
      } catch (err) {
        console.error('Error fetching secure cameras:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cameras');
        setCameras([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchCameras();
  }, []);

  const requestCameraAccess = async (cameraId: string): Promise<SecureCameraAccess | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_camera_stream_access', { camera_uuid: cameraId });

      if (error) {
        console.error('Error requesting camera access:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (err) {
      console.error('Error in requestCameraAccess:', err);
      return null;
    }
  };

  const logCameraAccess = async (cameraId: string, accessType: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Log the access attempt
      const { error } = await supabase
        .from('camera_access_log')
        .insert([{
          user_id: user.id,
          camera_id: cameraId,
          access_type: accessType,
          authorized: isAuthenticated
        }]);

      if (error) {
        console.error('Error logging camera access:', error);
      }
    } catch (err) {
      console.error('Error in logCameraAccess:', err);
    }
  };

  return {
    cameras,
    loading,
    error,
    isAuthenticated,
    userRole,
    requestCameraAccess,
    logCameraAccess
  };
};