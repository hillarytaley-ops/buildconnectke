import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderSecurityNoticeProps {
  userRole?: string | null;
  hasActiveRequest?: boolean;
  isAdmin?: boolean;
}

const ProviderSecurityNotice: React.FC<ProviderSecurityNoticeProps> = ({
  userRole,
  hasActiveRequest = false,
  isAdmin = false
}) => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                Provider Information Security
                <Badge variant="outline" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Protected
                </Badge>
              </h3>
            </div>
            
            <div className="text-xs space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400 mb-1">
                    ✓ Always Available
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Provider name & verification</li>
                    <li>• Rating & review count</li>
                    <li>• Vehicle types & capacity</li>
                    <li>• General service areas</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Restricted Access
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Phone & email contact</li>
                    <li>• Exact addresses</li>
                    <li>• Pricing information</li>
                    <li>• Current location data</li>
                  </ul>
                </div>
              </div>
              
              <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                <Eye className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Your Access Level:</strong> {
                    isAdmin ? "Administrator - Full access with logging" :
                    hasActiveRequest ? "Active Partner - Contact info available" :
                    userRole === 'builder' ? "Builder - Public info only, contact via requests" :
                    userRole === 'delivery_provider' ? "Provider - Can view own profile" :
                    "Limited - Public information only"
                  }
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center gap-2 text-muted-foreground border-t pt-2">
                <AlertTriangle className="h-3 w-3" />
                <span>All sensitive data access is logged for security compliance</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderSecurityNotice;