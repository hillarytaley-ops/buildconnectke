import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RotateCcw, Users, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProviderRotationStatusProps {
  requestId: string;
  onStatusChange?: (status: string) => void;
}

interface QueueItem {
  provider_id: string;
  queue_position: number;
  status: string;
  contacted_at?: string;
  responded_at?: string;
  timeout_at: string;
  delivery_providers: {
    provider_name: string;
    rating: number;
  };
}

interface RequestData {
  id: string;
  status: string;
  attempted_providers: string[];
  max_rotation_attempts: number;
  auto_rotation_enabled: boolean;
  rotation_completed_at?: string;
  created_at: string;
}

const ProviderRotationStatus: React.FC<ProviderRotationStatusProps> = ({
  requestId,
  onStatusChange
}) => {
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRotationStatus();

    // Set up real-time subscription for queue updates
    const channel = supabase
      .channel(`provider-queue-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_provider_queue',
          filter: `request_id=eq.${requestId}`
        },
        (payload) => {
          console.log('Queue update:', payload);
          fetchRotationStatus();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'delivery_requests',
          filter: `id=eq.${requestId}`
        },
        (payload) => {
          console.log('Request update:', payload);
          fetchRotationStatus();
          if (onStatusChange && payload.new) {
            onStatusChange(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, onStatusChange]);

  const fetchRotationStatus = async () => {
    try {
      setLoading(true);

      // Fetch request data
      const { data: request, error: requestError } = await supabase
        .from('delivery_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;
      setRequestData(request);

      // Fetch queue data
      const { data: queue, error: queueError } = await supabase
        .from('delivery_provider_queue')
        .select(`
          *,
          delivery_providers(provider_name, rating)
        `)
        .eq('request_id', requestId)
        .order('queue_position');

      if (queueError) throw queueError;
      setQueueData(queue || []);

    } catch (error) {
      console.error('Error fetching rotation status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load rotation status"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'contacted':
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'timeout':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      contacted: "default",
      accepted: "default",
      rejected: "destructive",
      timeout: "outline"
    };

    return (
      <Badge variant={variants[status] || "secondary"} className="text-xs">
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const calculateProgress = () => {
    if (!requestData || !queueData.length) return 0;
    
    const totalProviders = queueData.length;
    const contactedOrResponded = queueData.filter(
      item => ['contacted', 'accepted', 'rejected', 'timeout'].includes(item.status)
    ).length;
    
    return Math.round((contactedOrResponded / totalProviders) * 100);
  };

  const getCurrentProvider = () => {
    return queueData.find(item => item.status === 'contacted');
  };

  const getCompletedProviders = () => {
    return queueData.filter(item => ['accepted', 'rejected', 'timeout'].includes(item.status));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!requestData?.auto_rotation_enabled || queueData.length === 0) {
    return null; // Don't show if rotation is disabled or no queue
  }

  const currentProvider = getCurrentProvider();
  const completedProviders = getCompletedProviders();
  const progress = calculateProgress();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-primary" />
          Provider Rotation Status
        </CardTitle>
        <CardDescription>
          Automatic provider selection progress • {requestData.attempted_providers?.length || 0} of {requestData.max_rotation_attempts} attempts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Status Alert */}
        {requestData.status === 'pending' && currentProvider && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              Currently contacting: <strong>{currentProvider.delivery_providers?.provider_name}</strong> 
              (Position {currentProvider.queue_position} in queue)
            </AlertDescription>
          </Alert>
        )}

        {requestData.status === 'accepted' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Provider found! Request has been accepted.
            </AlertDescription>
          </Alert>
        )}

        {(requestData.status === 'rotation_failed' || requestData.status === 'no_providers_available') && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {requestData.status === 'rotation_failed' 
                ? 'Maximum rotation attempts reached. Please try creating a new request.'
                : 'No more providers available in your area. Consider expanding your search criteria.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Provider Queue */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Provider Queue</h4>
          <div className="space-y-2">
            {queueData.map((item) => (
              <div
                key={item.provider_id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.status === 'contacted' ? 'border-blue-200 bg-blue-50' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      {item.queue_position}
                    </span>
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {item.delivery_providers?.provider_name || 'Unknown Provider'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rating: {item.delivery_providers?.rating || 0}/5
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  {item.status === 'contacted' && (
                    <Badge variant="outline" className="text-xs animate-pulse">
                      Waiting Response
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{queueData.length}</div>
            <div className="text-xs text-muted-foreground">Total Providers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentProvider ? 1 : 0}</div>
            <div className="text-xs text-muted-foreground">Currently Contacted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedProviders.filter(p => p.status === 'accepted').length}
            </div>
            <div className="text-xs text-muted-foreground">Accepted</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderRotationStatus;