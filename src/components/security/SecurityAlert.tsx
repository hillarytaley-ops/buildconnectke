import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

interface SecurityAlertProps {
  isAuthenticated: boolean;
  userRole?: string | null;
  showContactInfo: boolean;
  adminMessage?: string;
}

export const SecurityAlert = ({ isAuthenticated, userRole, showContactInfo, adminMessage }: SecurityAlertProps) => {
  if (!isAuthenticated) {
    return (
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Limited Information Available</AlertTitle>
        <AlertDescription className="text-amber-700">
          Sign in to view contact details and connect with builders and suppliers. 
          Contact information is protected for privacy and security.
        </AlertDescription>
      </Alert>
    );
  }

  if (!showContactInfo) {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 flex items-center gap-2">
          Contact Information Protected
          <Badge variant="secondary" className="text-xs">
            <Lock className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          Contact details are available through our secure messaging system to prevent spam and protect privacy.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`mb-6 ${userRole === 'admin' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
      <Eye className="h-4 w-4 text-green-600" />
      <AlertTitle className={`${userRole === 'admin' ? 'text-red-800' : 'text-green-800'} flex items-center gap-2`}>
        {userRole === 'admin' ? 'Admin Access - Sensitive Data' : 'Full Access Active'}
        <Badge variant="secondary" className={`text-xs ${userRole === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {userRole === 'admin' ? 'Administrator' : 'Verified User'}
        </Badge>
      </AlertTitle>
      <AlertDescription className={`${userRole === 'admin' ? 'text-red-700' : 'text-green-700'}`}>
        {adminMessage || (userRole === 'admin' 
          ? "You have administrative access to all supplier data including sensitive contact information. Handle with extreme care."
          : "You have access to contact information. Please use responsibly and respect privacy."
        )}
      </AlertDescription>
    </Alert>
  );
};