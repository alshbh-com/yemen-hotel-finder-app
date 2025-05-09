
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, Globe, Hotel, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        return;
      }
      
      if (data.session) {
        setUser(data.session.user);
        
        // Check if user is admin
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.session.user.id)
          .single();
          
        if (!profileError && profileData) {
          setIsAdmin(profileData.is_admin || false);
        }
      }
    };
    
    checkUserSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          
          // Check if user is admin
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();
            
          if (!profileError && profileData) {
            setIsAdmin(profileData.is_admin || false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Hotel className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">فندقي</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
          <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-primary">
            الرئيسية
          </Link>
          <Link to="/hotels" className="px-3 py-2 text-sm font-medium hover:text-primary">
            الفنادق
          </Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium hover:text-primary">
            عن التطبيق
          </Link>
          <Link to="/contact" className="px-3 py-2 text-sm font-medium hover:text-primary">
            اتصل بنا
          </Link>
          {isAdmin && (
            <Link to="/admin" className="px-3 py-2 text-sm font-medium text-primary hover:text-primary/80">
              <Settings className="w-4 h-4 inline ml-1" />
              لوحة التحكم
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Globe className="w-5 h-5" />
          </Button>
          
          {!user ? (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <User className="w-4 h-4 mr-2" />
                تسجيل الدخول
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogout}>
                تسجيل الخروج
              </Button>
              {user && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/hotels"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الفنادق
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              عن التطبيق
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              اتصل بنا
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center px-3 py-2 text-sm font-medium text-primary hover:text-primary/80"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 ml-2" />
                لوحة التحكم
              </Link>
            )}
            
            {!user ? (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 ml-2" />
                تسجيل الدخول
              </Link>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                تسجيل الخروج
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
