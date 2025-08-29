
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from '@supabase/supabase-js';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/builders", label: "Builders" },
    { path: "/suppliers", label: "Suppliers" },
    { path: "/delivery", label: "Delivery" },
    { path: "/tracking", label: "Tracking" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/feedback", label: "Feedback" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message
      });
    } else {
      toast({
        title: "Signed out successfully"
      });
    }
  };

  return (
    <header className="shadow-sm border-b sticky top-0 z-50 bg-gradient-primary relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center">
          <div className="relative">
            {/* Logo in center */}
            <div className="bg-background rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-12 h-12 flex items-center justify-center z-10">
              <img 
                src="/lovable-uploads/d3378e97-a017-41d4-892f-ef5860afe5a2.png" 
                alt="UjenziPro Logo" 
                className="w-8 h-8 object-cover rounded-full"
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-construction-orange ${
                isActive(item.path) ? "text-construction-orange font-bold" : "text-text-on-dark"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-text-on-dark">
                Welcome, {user.email}
              </span>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="text-text-on-dark border-border hover:bg-background hover:text-foreground"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="text-foreground bg-background/90 border-border hover:bg-background hover:text-foreground font-semibold shadow-lg">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-construction-orange text-foreground hover:bg-construction-orange/90 font-semibold shadow-lg">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-on-dark bg-background/20 p-2 rounded-lg border border-white/30 backdrop-blur-sm hover:bg-background/30 transition-all duration-200 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

        {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t shadow-lg z-50 absolute top-full left-0 right-0">
          <nav className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {user ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    Welcome, {user.email}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
