
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Eye,
  Search,
  Loader2,
  User,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async (userId: string) => {
    try {
      setLoadingBookings(true);
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id, 
          check_in, 
          check_out, 
          total_price, 
          status, 
          payment_status,
          hotels (name),
          rooms (name)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setUserBookings(data || []);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الحجوزات",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const openViewDialog = (user: any) => {
    setCurrentUser(user);
    setUserBookings([]);
    setIsViewDialogOpen(true);
    fetchUserBookings(user.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  const getFullName = (user: any) => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName} ${lastName}`.trim() || "غير معروف";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="text-green-500">مؤكد</span>;
      case "pending":
        return <span className="text-yellow-500">قيد الانتظار</span>;
      case "canceled":
        return <span className="text-red-500">ملغي</span>;
      case "completed":
        return <span className="text-blue-500">مكتمل</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="text-green-500">مدفوع</span>;
      case "unpaid":
        return <span className="text-yellow-500">غير مدفوع</span>;
      case "refunded":
        return <span className="text-blue-500">مسترد</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const filteredUsers = users.filter((user) =>
    (getFullName(user)).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="البحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">
            {searchTerm ? "لا توجد نتائج مطابقة لبحثك" : "لا يوجد مستخدمين بعد"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>المسؤول</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={getFullName(user)} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{getFullName(user)}</p>
                        <p className="text-sm text-gray-500">{user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <span className="text-primary">نعم</span>
                    ) : (
                      <span>لا</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openViewDialog(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
          </DialogHeader>
          
          {currentUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {currentUser.avatar_url ? (
                    <img 
                      src={currentUser.avatar_url} 
                      alt={getFullName(currentUser)} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{getFullName(currentUser)}</h3>
                  <p className="text-gray-500">{currentUser.id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">الاسم الأول</h3>
                  <p className="font-medium">{currentUser.first_name || "غير محدد"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">الاسم الأخير</h3>
                  <p className="font-medium">{currentUser.last_name || "غير محدد"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ التسجيل</h3>
                  <p className="font-medium">{formatDate(currentUser.created_at)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">المسؤول</h3>
                  <p className="font-medium">
                    {currentUser.is_admin ? (
                      <span className="text-primary">نعم</span>
                    ) : (
                      <span>لا</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">حجوزات المستخدم</h3>
                {loadingBookings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : userBookings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">لا توجد حجوزات لهذا المستخدم</p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>رقم الحجز</TableHead>
                          <TableHead>الفندق</TableHead>
                          <TableHead>الغرفة</TableHead>
                          <TableHead>تاريخ الإقامة</TableHead>
                          <TableHead>المبلغ</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>الدفع</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{booking.hotels?.name || "غير معروف"}</TableCell>
                            <TableCell>{booking.rooms?.name || "غير معروف"}</TableCell>
                            <TableCell>
                              {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                            </TableCell>
                            <TableCell>{booking.total_price} ر.س</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
