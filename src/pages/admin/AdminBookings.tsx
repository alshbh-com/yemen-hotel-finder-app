
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
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search, Loader2 } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          check_in,
          check_out,
          guests,
          total_price,
          status,
          payment_status,
          created_at,
          user_id,
          hotel_id,
          room_id,
          hotels (
            name
          ),
          rooms (
            name
          ),
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الحجوزات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      setFormSubmitting(true);
      
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث حالة الحجز بنجاح",
      });
      
      // Update the current booking if it's open in the dialog
      if (currentBooking && currentBooking.id === bookingId) {
        setCurrentBooking({ ...currentBooking, status });
      }
      
      // Update the booking in the list
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الحجز",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handlePaymentStatusChange = async (bookingId: string, payment_status: string) => {
    try {
      setFormSubmitting(true);
      
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status })
        .eq("id", bookingId);
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث حالة الدفع بنجاح",
      });
      
      // Update the current booking if it's open in the dialog
      if (currentBooking && currentBooking.id === bookingId) {
        setCurrentBooking({ ...currentBooking, payment_status });
      }
      
      // Update the booking in the list
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, payment_status } : booking
      ));
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الدفع",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const openViewDialog = (booking: any) => {
    setCurrentBooking(booking);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">مؤكد</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">قيد الانتظار</Badge>;
      case "canceled":
        return <Badge className="bg-red-500">ملغي</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">مكتمل</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">مدفوع</Badge>;
      case "unpaid":
        return <Badge className="bg-yellow-500">غير مدفوع</Badge>;
      case "refunded":
        return <Badge className="bg-blue-500">مسترد</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFullName = (booking: any) => {
    if (!booking.profiles) return "غير معروف";
    const firstName = booking.profiles.first_name || "";
    const lastName = booking.profiles.last_name || "";
    return `${firstName} ${lastName}`.trim() || "غير معروف";
  };

  const filteredBookings = bookings.filter((booking) =>
    getFullName(booking).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.hotels?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.rooms?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الحجوزات</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="البحث عن حجز..."
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
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">
            {searchTerm ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد حجوزات بعد"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الحجز</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الفندق</TableHead>
                <TableHead>تاريخ الوصول</TableHead>
                <TableHead>تاريخ المغادرة</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>حالة الحجز</TableHead>
                <TableHead>حالة الدفع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{getFullName(booking)}</TableCell>
                  <TableCell>{booking.hotels?.name || "غير معروف"}</TableCell>
                  <TableCell>{formatDate(booking.check_in)}</TableCell>
                  <TableCell>{formatDate(booking.check_out)}</TableCell>
                  <TableCell>{booking.total_price} ر.س</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openViewDialog(booking)}>
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
      
      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
          </DialogHeader>
          
          {currentBooking && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">رقم الحجز</h3>
                    <p className="font-medium">{currentBooking.id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">العميل</h3>
                    <p className="font-medium">{getFullName(currentBooking)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">الفندق</h3>
                    <p className="font-medium">{currentBooking.hotels?.name || "غير معروف"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">الغرفة</h3>
                    <p className="font-medium">{currentBooking.rooms?.name || "غير معروف"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ الحجز</h3>
                    <p className="font-medium">{formatDate(currentBooking.created_at)}</p>
                  </div>
                </div>
                
                {/* Stay Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ الوصول</h3>
                    <p className="font-medium">{formatDate(currentBooking.check_in)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">تاريخ المغادرة</h3>
                    <p className="font-medium">{formatDate(currentBooking.check_out)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">عدد الضيوف</h3>
                    <p className="font-medium">{currentBooking.guests}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">المبلغ الإجمالي</h3>
                    <p className="font-medium">{currentBooking.total_price} ر.س</p>
                  </div>
                </div>
              </div>
              
              {/* Status Management */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">إدارة الحجز</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">حالة الحجز</h4>
                    <Select
                      value={currentBooking.status}
                      onValueChange={(value) => handleStatusChange(currentBooking.id, value)}
                      disabled={formSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة الحجز" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="confirmed">مؤكد</SelectItem>
                        <SelectItem value="completed">مكتمل</SelectItem>
                        <SelectItem value="canceled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">حالة الدفع</h4>
                    <Select
                      value={currentBooking.payment_status}
                      onValueChange={(value) => handlePaymentStatusChange(currentBooking.id, value)}
                      disabled={formSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر حالة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">غير مدفوع</SelectItem>
                        <SelectItem value="paid">مدفوع</SelectItem>
                        <SelectItem value="refunded">مسترد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

export default AdminBookings;
