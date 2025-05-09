
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MapPin,
  Star,
  Calendar,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapIcon,
  Phone,
  Wifi,
  Coffee,
  Car,
  Utensils,
  ParkingCircle,
  Snowflake,
  DumbbellIcon,
  Pool,
} from "lucide-react";

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch hotel details
      const { data: hotelData, error: hotelError } = await supabase
        .from("hotels")
        .select("*")
        .eq("id", id)
        .single();
        
      if (hotelError) throw hotelError;
      
      // Fetch rooms for the hotel
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .eq("hotel_id", id);
        
      if (roomsError) throw roomsError;
      
      setHotel(hotelData);
      setRooms(roomsData || []);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الفندق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (!hotel || !hotel.images || hotel.images.length === 0) return;
    setActiveImageIndex((prev) => (prev === 0 ? hotel.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!hotel || !hotel.images || hotel.images.length === 0) return;
    setActiveImageIndex((prev) => (prev === hotel.images.length - 1 ? 0 : prev + 1));
  };

  const openBookingDialog = (room: any) => {
    setSelectedRoom(room);
    setIsBookingDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value,
    });
  };

  const handleBookingSubmit = async () => {
    if (!hotel || !selectedRoom) return;
    
    const { checkIn, checkOut, guests, name, email, phone } = bookingForm;
    
    if (!checkIn || !checkOut || !guests || !name || !email || !phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      // Calculate total price based on number of nights
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nights <= 0) {
        toast({
          title: "خطأ",
          description: "تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول",
          variant: "destructive",
        });
        return;
      }
      
      const totalPrice = selectedRoom.price_per_night * nights;
      
      // Get logged in user (if any)
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        toast({
          title: "يجب تسجيل الدخول",
          description: "يرجى تسجيل الدخول لإتمام عملية الحجز",
          variant: "destructive",
        });
        return;
      }
      
      // Create booking
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_id: user.id,
            hotel_id: hotel.id,
            room_id: selectedRoom.id,
            check_in: checkIn,
            check_out: checkOut,
            guests: parseInt(guests.toString()),
            total_price: totalPrice,
            status: "pending",
            payment_status: "unpaid",
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "تم الحجز بنجاح",
        description: "تم إرسال طلب الحجز الخاص بك وسيتم التواصل معك قريباً",
      });
      
      setIsBookingDialogOpen(false);
      
      // Reset form
      setBookingForm({
        checkIn: "",
        checkOut: "",
        guests: 1,
        name: "",
        email: "",
        phone: "",
        notes: "",
      });
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحجز",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const getStars = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 text-yellow-400 fill-yellow-400"
        />
      ));
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="h-5 w-5" />;
    if (lowerAmenity.includes("إفطار") || lowerAmenity.includes("افطار")) return <Coffee className="h-5 w-5" />;
    if (lowerAmenity.includes("مواقف") || lowerAmenity.includes("موقف") || lowerAmenity.includes("سيارات")) return <Car className="h-5 w-5" />;
    if (lowerAmenity.includes("مطعم")) return <Utensils className="h-5 w-5" />;
    if (lowerAmenity.includes("تكييف")) return <Snowflake className="h-5 w-5" />;
    if (lowerAmenity.includes("صالة") || lowerAmenity.includes("لياقة") || lowerAmenity.includes("رياضة")) return <DumbbellIcon className="h-5 w-5" />;
    if (lowerAmenity.includes("مسبح") || lowerAmenity.includes("سباحة")) return <Pool className="h-5 w-5" />;
    return <ParkingCircle className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الفندق</h2>
          <p className="text-gray-600 mb-8">الفندق الذي تبحث عنه غير موجود أو تم حذفه</p>
          <Link to="/hotels">
            <Button>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى قائمة الفنادق
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link to="/hotels" className="text-gray-500 hover:text-primary">الفنادق</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{hotel.name}</span>
        </div>
        
        {/* Hotel Name and Rating */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{hotel.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {getStars(hotel.stars)}
              </div>
              <div className="flex items-center mr-4">
                <MapPin className="h-4 w-4 text-gray-500 ml-1" />
                <span className="text-gray-500 text-sm">{hotel.address}, {hotel.city}, {hotel.country}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {hotel.rating ? (
              <div className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-md">
                <Star className="h-4 w-4 fill-white" />
                <span>{hotel.rating.toFixed(1)}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">لم يتم التقييم بعد</div>
            )}
          </div>
        </div>
        
        {/* Hotel Images */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-8 h-[300px] md:h-[400px] lg:h-[500px]">
          {/* Main Image */}
          {hotel.images && hotel.images.length > 0 ? (
            <img
              src={hotel.images[activeImageIndex]}
              alt={`${hotel.name} - صورة ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">لا توجد صور متاحة</p>
            </div>
          )}
          
          {/* Navigation arrows */}
          {hotel.images && hotel.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {hotel.images.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Hotel Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="rooms">الغرف</TabsTrigger>
                <TabsTrigger value="amenities">المرافق والخدمات</TabsTrigger>
                <TabsTrigger value="location">الموقع</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">عن الفندق</h2>
                  <p className="text-gray-700 whitespace-pre-line">{hotel.description}</p>
                  
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-bold mb-3">أبرز المرافق</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.amenities.slice(0, 6).map((amenity: string, index: number) => (
                          <div key={index} className="flex items-center">
                            {getAmenityIcon(amenity)}
                            <span className="mr-2">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rooms">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">الغرف المتاحة</h2>
                  
                  {rooms.length === 0 ? (
                    <p className="text-gray-500 py-4">لا توجد معلومات عن الغرف حالياً</p>
                  ) : (
                    <div className="space-y-6">
                      {rooms.map((room) => (
                        <div 
                          key={room.id} 
                          className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
                        >
                          <div className="w-full md:w-1/4 h-32 md:h-auto">
                            {room.images && room.images.length > 0 ? (
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                                <p className="text-gray-400 text-sm">لا توجد صورة</p>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <h3 className="text-lg font-bold">{room.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{room.price_per_night} ر.س</span>
                                <span className="text-sm text-gray-500">/ ليلة</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2 mb-3">{room.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <div className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                                <Users className="h-3 w-3 ml-1" />
                                {room.capacity} ضيف
                              </div>
                              {room.amenities && room.amenities.map((amenity: string, i: number) => (
                                <div key={i} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                  {amenity}
                                </div>
                              ))}
                            </div>
                            <Button onClick={() => openBookingDialog(room)}>
                              احجز الآن
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="amenities">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">المرافق والخدمات</h2>
                  
                  {hotel.amenities && hotel.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hotel.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center">
                          {getAmenityIcon(amenity)}
                          <span className="mr-3">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 py-4">لا توجد معلومات عن المرافق حالياً</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">الموقع</h2>
                  <div className="flex items-start mb-4">
                    <MapPin className="h-5 w-5 text-primary mt-1 ml-2" />
                    <div>
                      <p className="font-medium">{hotel.address}</p>
                      <p className="text-gray-500">{hotel.city}، {hotel.country}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">خريطة الموقع غير متاحة حالياً</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20">
              <h2 className="text-xl font-bold mb-4">احجز الآن</h2>
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">السعر يبدأ من</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{hotel.price_per_night} ر.س</span>
                    <span className="text-gray-500 text-sm block">لليلة الواحدة</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary ml-3" />
                  <div>
                    <p className="font-medium">اتصل بنا</p>
                    <p className="text-gray-500 text-sm">+967 1 234 5678</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full" onClick={() => {
                if (rooms.length > 0) {
                  openBookingDialog(rooms[0]);
                } else {
                  toast({
                    title: "لا توجد غرف متاحة",
                    description: "لا توجد غرف متاحة للحجز حالياً",
                    variant: "destructive",
                  });
                }
              }}>
                احجز الآن
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>احجز غرفتك الآن</DialogTitle>
            <DialogDescription>
              أدخل بياناتك لإتمام عملية الحجز
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row gap-4 border-b pb-4 mb-4">
                <div className="w-full md:w-1/3 h-32">
                  {selectedRoom.images && selectedRoom.images.length > 0 ? (
                    <img
                      src={selectedRoom.images[0]}
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-gray-400 text-sm">لا توجد صورة</p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{hotel.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedRoom.name}</p>
                  <div className="flex items-center text-sm bg-gray-100 w-fit px-2 py-1 rounded">
                    <Users className="h-3 w-3 ml-1" />
                    {selectedRoom.capacity} ضيف
                  </div>
                  <div className="mt-2 font-bold text-primary">
                    {selectedRoom.price_per_night} ر.س / ليلة
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">تاريخ الوصول *</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      type="date"
                      name="checkIn"
                      value={bookingForm.checkIn}
                      onChange={handleInputChange}
                      className="pl-3 pr-10"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">تاريخ المغادرة *</label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      type="date"
                      name="checkOut"
                      value={bookingForm.checkOut}
                      onChange={handleInputChange}
                      className="pl-3 pr-10"
                      min={bookingForm.checkIn || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">عدد الضيوف *</label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      type="number"
                      name="guests"
                      value={bookingForm.guests}
                      onChange={handleInputChange}
                      className="pl-3 pr-10"
                      min="1"
                      max={selectedRoom.capacity}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium mb-4">بيانات الحجز</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">الاسم الكامل *</label>
                    <Input
                      type="text"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">البريد الإلكتروني *</label>
                    <Input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      placeholder="example@domain.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">رقم الهاتف *</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      placeholder="+967 XXX XXX XXX"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium">ملاحظات إضافية</label>
                <Textarea
                  name="notes"
                  value={bookingForm.notes}
                  onChange={handleInputChange}
                  placeholder="أي متطلبات خاصة أو معلومات إضافية..."
                  rows={3}
                />
              </div>
              
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">تنبيه هام</h4>
                <p className="text-gray-600 text-sm">
                  يعد هذا طلب حجز فقط وليس تأكيداً نهائياً. سيتم التواصل معك من قبل فريق خدمة العملاء لتأكيد الحجز وإتمام عملية الدفع.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleBookingSubmit} disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري إرسال الطلب...
                </>
              ) : (
                "تأكيد الحجز"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default HotelDetails;
