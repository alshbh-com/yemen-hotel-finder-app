
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { Hotel, Users, BookOpen, LayoutDashboard, LogOut, Settings, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import AdminHotels from "./AdminHotels";
import AdminRooms from "./AdminRooms";
import AdminBookings from "./AdminBookings";
import AdminUsers from "./AdminUsers";
import AdminHome from "./AdminHome";

const ADMIN_PASSWORD = "01278006248";

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session?.user) {
          setUser(data.session.user);
          // Verify if they have already entered the admin password
          const isAdminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
          if (isAdminAuthenticated) {
            setAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const handleAdminLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } else {
      toast({
        title: "كلمة المرور غير صحيحة",
        description: "الرجاء إدخال كلمة المرور الصحيحة",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("adminAuthenticated");
      setAuthenticated(false);
      setUser(null);
      navigate("/login");
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "فشل تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2">
              <Hotel className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">فندقي</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">لوحة التحكم</h1>
            <p className="text-gray-600 mb-6 text-center">
              يجب تسجيل الدخول أولاً للوصول إلى لوحة التحكم
            </p>
            
            <Button 
              onClick={() => navigate("/login")}
              className="w-full"
            >
              تسجيل الدخول
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:underline">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2">
              <Hotel className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">فندقي - لوحة التحكم</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">تسجيل دخول المدير</h1>
            <p className="text-gray-600 mb-6 text-center">
              أدخل كلمة مرور المدير للوصول إلى لوحة التحكم
            </p>
            
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="كلمة مرور المدير"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <Button 
                onClick={handleAdminLogin}
                className="w-full"
              >
                دخول
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:underline">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar Toggle Button for Mobile */}
      <button 
        className="fixed top-4 right-4 z-50 md:hidden bg-primary text-white p-2 rounded-full shadow-md"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {/* Sidebar */}
      <aside className={`bg-white w-64 shadow-md p-4 flex flex-col fixed inset-y-0 right-0 z-40 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-2 mb-8">
          <Hotel className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-primary">لوحة التحكم</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link to="/admin" className="flex items-center p-3 rounded-md hover:bg-gray-100">
            <LayoutDashboard className="ml-3 w-5 h-5" />
            <span>لوحة المعلومات</span>
          </Link>
          <Link to="/admin/hotels" className="flex items-center p-3 rounded-md hover:bg-gray-100">
            <Hotel className="ml-3 w-5 h-5" />
            <span>الفنادق</span>
          </Link>
          <Link to="/admin/rooms" className="flex items-center p-3 rounded-md hover:bg-gray-100">
            <BookOpen className="ml-3 w-5 h-5" />
            <span>الغرف</span>
          </Link>
          <Link to="/admin/bookings" className="flex items-center p-3 rounded-md hover:bg-gray-100">
            <BookOpen className="ml-3 w-5 h-5" />
            <span>الحجوزات</span>
          </Link>
          <Link to="/admin/users" className="flex items-center p-3 rounded-md hover:bg-gray-100">
            <Users className="ml-3 w-5 h-5" />
            <span>المستخدمين</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center p-3 rounded-md hover:bg-gray-100">
            <Settings className="ml-3 w-5 h-5" />
            <span>الإعدادات</span>
          </Link>
        </nav>
        
        <div className="pt-4 mt-6 border-t">
          <div className="mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-gray-500">مدير</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center"
          >
            <LogOut className="ml-2 w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className={`flex-1 p-6 md:p-8 transition-all ${showSidebar ? 'mr-0 md:mr-64' : 'mr-0'}`}>
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-3rem)]">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/hotels" element={<AdminHotels />} />
            <Route path="/rooms" element={<AdminRooms />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/settings" element={<div>إعدادات النظام</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
