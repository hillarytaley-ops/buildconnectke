import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecureCameraData {
  id: string;
  name: string;
  location: string;
  project_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  can_view_stream: boolean;
  stream_access_message: string;
  general_location: string;
}

interface CameraStreamData {
  camera_id: string;
  camera_name: string;
  stream_url: string;
  can_access: boolean;
  access_message: string;
}

interface UseSecureCamerasResult {
  cameras: SecureCameraData[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  getSecureCameraInfo: (cameraId: string) => Promise<SecureCameraData | null>;
  getSecureCameraStream: (cameraId: string) => Promise<CameraStreamData | null>;
  logCameraAccess: (cameraId: string, accessType: string) => Promise<void>;
}

export const useSecureCameras = (): UseSecureCamerasResult => {
  const [cameras, setCameras] = useState<SecureCameraData[]>([]);
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

          // Fetch cameras using secure policies
          // Only cameras user has access to will be returned
          const { data, error: fetchError } = await supabase
            .from('cameras')
            .select('id, name, location, project_id, is_active, created_at, updated_at')
            .eq('is_active', true);

          if (fetchError) {
            // If access is denied, user sees no cameras (secure default)
            console.log('Camera access restricted:', fetchError.message);
            setCameras([]);
          } else {
            // Transform data to secure format
            const secureCameras = (data || []).map(camera => ({
              ...camera,
              can_view_stream: false, // Will be determined per-camera
              stream_access_message: 'Stream access requires authorization',
              general_location: camera.location ? 
                camera.location.split(',').pop()?.trim() || 'Construction site' : 
                'Construction site'
            }));
            setCameras(secureCameras);
          }
        } else {
          setCameras([]);
        }
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

  const getSecureCameraInfo = async (cameraId: string): Promise<SecureCameraData | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_secure_camera_info', { camera_uuid: cameraId });

      if (error) {
        console.error('Error fetching secure camera info:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (err) {
      console.error('Error in getSecureCameraInfo:', err);
      return null;
    }
  };

  const getSecureCameraStream = async (cameraId: string): Promise<CameraStreamData | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_secure_camera_stream', { camera_uuid: cameraId });

      if (error) {
        console.error('Error fetching secure camera stream:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (err) {
      console.error('Error in getSecureCameraStream:', err);
      return null;
    }
  };

  const logCameraAccess = async (cameraId: string, accessType: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get camera project for logging
      const { data: camera } = await supabase
        .from('cameras')
        .select('project_id')
        .eq('id', cameraId)
        .single();

      // Log the access attempt
      const { error } = await supabase
        .from('camera_access_log')
        .insert([{
          user_id: user.id,
          camera_id: cameraId,
          access_type: accessType,
          project_id: camera?.project_id,
          authorized: true // If we get here, user has some level of access
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
    getSecureCameraInfo,
    getSecureCameraStream,
    logCameraAccess
  };
};