
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, User, BookOpen, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total hotels
        const { count: hotelsCount, error: hotelsError } = await supabase
          .from("hotels")
          .select("*", { count: "exact", head: true });
        
        if (hotelsError) throw hotelsError;
        
        // Get total profiles (users)
        const { count: usersCount, error: usersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
          
        if (usersError) throw usersError;
        
        // Get total bookings
        const { count: bookingsCount, error: bookingsError } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });
        
        if (bookingsError) throw bookingsError;
        
        // Get total revenue
        const { data: bookings, error: revenueError } = await supabase
          .from("bookings")
          .select("total_price");
          
        if (revenueError) throw revenueError;
        
        const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;
        
        setStats({
          totalHotels: hotelsCount || 0,
          totalUsers: usersCount || 0,
          totalBookings: bookingsCount || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const cardClasses = "cursor-pointer transition-all hover:shadow-md";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة المعلومات</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
              <CardContent className="p-6"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={cardClasses} onClick={() => navigate("/admin/hotels")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الفنادق</CardTitle>
                <Hotel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalHotels}</div>
                <p className="text-xs text-muted-foreground">فندق مسجل في النظام</p>
              </CardContent>
            </Card>
            
            <Card className={cardClasses} onClick={() => navigate("/admin/users")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">مستخدم مسجل في النظام</p>
              </CardContent>
            </Card>
            
            <Card className={cardClasses} onClick={() => navigate("/admin/bookings")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">حجز تم في النظام</p>
              </CardContent>
            </Card>
            
            <Card className={cardClasses} onClick={() => navigate("/admin/bookings")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">من جميع الحجوزات</p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-bold mt-10 mb-4">آخر المستجدات</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أحدث الحجوزات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  {stats.totalBookings > 0 ? 
                    "يتم تحميل أحدث الحجوزات..." :
                    "لا توجد حجوزات بعد"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أحدث المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  {stats.totalUsers > 0 ? 
                    "يتم تحميل أحدث المستخدمين..." :
                    "لا يوجد مستخدمين بعد"}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;
