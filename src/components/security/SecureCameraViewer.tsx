import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureCameras } from '@/hooks/useSecureCameras';
import { useToast } from '@/hooks/use-toast';

interface SecureCameraViewerProps {
  cameraId: string;
  cameraName: string;
  projectId?: string;
  className?: string;
}

export const SecureCameraViewer = ({ 
  cameraId, 
  cameraName, 
  projectId,
  className 
}: SecureCameraViewerProps) => {
  const [streamAccess, setStreamAccess] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const { requestCameraAccess, logCameraAccess, isAuthenticated, userRole } = useSecureCameras();
  const { toast } = useToast();

  const handleRequestCameraAccess = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to access camera feeds."
      });
      return;
    }

    setLoading(true);
    try {
      // Log the access request
      await logCameraAccess(cameraId, 'stream_access_requested');
      
      // Request camera stream access
      const accessInfo = await requestCameraAccess(cameraId);
      setStreamAccess(accessInfo);
      setHasRequested(true);

      if (accessInfo?.can_access_stream) {
        toast({
          title: "Camera access granted",
          description: "You now have access to the camera stream."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Access restricted", 
          description: accessInfo?.access_message || "Camera access not available."
        });
      }
    } catch (error) {
      console.error('Error requesting camera access:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to request camera access."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCameraViewer = () => {
    if (!hasRequested) {
      return (
        <Card className={className}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Secure Camera Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium">{cameraName}</h3>
                <p className="text-sm text-muted-foreground">Project surveillance camera</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-3 w-3" />
                Camera stream is access-controlled
              </div>
              
              <Button 
                onClick={handleRequestCameraAccess}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Eye className="h-3 w-3 mr-2" />
                {loading ? 'Requesting Access...' : 'Request Camera Access'}
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Camera access is restricted to project participants and logged for security.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!streamAccess) {
      return (
        <Card className={className}>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              Camera access information unavailable
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            {streamAccess.camera_name}
            {streamAccess.can_access_stream ? (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                {streamAccess.access_level}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Restricted</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {streamAccess.can_access_stream && streamAccess.stream_url ? (
              <div className="space-y-3">
                <div className="aspect-video bg-black rounded-md flex items-center justify-center">
                  <iframe
                    src={streamAccess.stream_url}
                    className="w-full h-full rounded-md"
                    frameBorder="0"
                    allowFullScreen
                    title={`Camera feed: ${streamAccess.camera_name}`}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Eye className="h-3 w-3" />
                  <span>Live stream active</span>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Stream access restricted</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium">Security Notice</p>
                <p>{streamAccess.access_message}</p>
              </div>
            </div>
            
            {!streamAccess.can_access_stream && (
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Access Requirements</p>
                  <p>Camera access is restricted to project participants during active phases.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return renderCameraViewer();
};