
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
import { Textarea } from "@/components/ui/textarea";
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
import { Pen, Trash2, Plus, BedDouble, Loader2, Search } from "lucide-react";

const AdminRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_per_night: 0,
    capacity: 1,
    hotel_id: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select(`
          id,
          name,
          description,
          price_per_night,
          capacity,
          amenities,
          hotel_id,
          hotels (
            name
          )
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setRooms(data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الغرف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from("hotels")
        .select("id, name")
        .order("name");
        
      if (error) throw error;
      
      setHotels(data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الفنادق",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      amenities: value.split(",").map(item => item.trim()),
    });
  };

  const openAddDialog = () => {
    if (hotels.length === 0) {
      toast({
        title: "لا يمكن إضافة غرفة",
        description: "يجب إضافة فندق أولاً قبل إضافة الغرف",
        variant: "destructive",
      });
      return;
    }
    
    setFormData({
      name: "",
      description: "",
      price_per_night: 0,
      capacity: 1,
      hotel_id: hotels[0]?.id || "",
      amenities: [],
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (room: any) => {
    setCurrentRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      price_per_night: room.price_per_night,
      capacity: room.capacity,
      hotel_id: room.hotel_id,
      amenities: room.amenities || [],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (room: any) => {
    setCurrentRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    try {
      setFormSubmitting(true);
      
      if (!formData.name || !formData.description || !formData.hotel_id || formData.price_per_night <= 0) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("rooms")
        .insert([{
          name: formData.name,
          description: formData.description,
          price_per_night: formData.price_per_night,
          capacity: formData.capacity,
          hotel_id: formData.hotel_id,
          amenities: formData.amenities,
          images: [],
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الغرفة بنجاح",
      });
      
      setIsAddDialogOpen(false);
      fetchRooms();
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الغرفة",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setFormSubmitting(true);
      
      if (!formData.name || !formData.description || !formData.hotel_id || formData.price_per_night <= 0) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("rooms")
        .update({
          name: formData.name,
          description: formData.description,
          price_per_night: formData.price_per_night,
          capacity: formData.capacity,
          hotel_id: formData.hotel_id,
          amenities: formData.amenities,
        })
        .eq("id", currentRoom.id)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الغرفة بنجاح",
      });
      
      setIsEditDialogOpen(false);
      fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات الغرفة",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setFormSubmitting(true);
      
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", currentRoom.id);
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف الغرفة بنجاح",
      });
      
      setIsDeleteDialogOpen(false);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الغرفة",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.hotels?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الغرف</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="البحث عن غرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Button onClick={openAddDialog}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة غرفة جديدة
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">
            {searchTerm ? "لا توجد نتائج مطابقة لبحثك" : "لم يتم إضافة أي غرف بعد"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الغرفة</TableHead>
                <TableHead>الفندق</TableHead>
                <TableHead>السعر/ليلة</TableHead>
                <TableHead>السعة</TableHead>
                <TableHead>المميزات</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.hotels?.name || "غير معروف"}</TableCell>
                  <TableCell>{room.price_per_night} ر.س</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {room.capacity}
                      <BedDouble className="h-4 w-4 ml-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(room.amenities || []).slice(0, 2).map((amenity: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {(room.amenities || []).length > 2 && (
                        <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                          +{room.amenities.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(room)}>
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(room)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة غرفة جديدة</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم الغرفة *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="اسم الغرفة"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الفندق *</label>
              <Select
                value={formData.hotel_id}
                onValueChange={(value) => handleSelectChange("hotel_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفندق" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">السعر لليلة الواحدة *</label>
              <Input
                name="price_per_night"
                type="number"
                value={formData.price_per_night}
                onChange={handleInputChange}
                placeholder="السعر بالريال السعودي"
                min={0}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">السعة (عدد الأشخاص) *</label>
              <Input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="عدد الأشخاص"
                min={1}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">المميزات (مفصولة بفاصلة)</label>
              <Input
                name="amenities"
                value={formData.amenities.join(", ")}
                onChange={handleAmenitiesChange}
                placeholder="تلفاز, تكييف, واي فاي..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">وصف الغرفة *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف تفصيلي للغرفة"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddSubmit} disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة الغرفة"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الغرفة</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم الغرفة *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="اسم الغرفة"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الفندق *</label>
              <Select
                value={formData.hotel_id}
                onValueChange={(value) => handleSelectChange("hotel_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفندق" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">السعر لليلة الواحدة *</label>
              <Input
                name="price_per_night"
                type="number"
                value={formData.price_per_night}
                onChange={handleInputChange}
                placeholder="السعر بالريال السعودي"
                min={0}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">السعة (عدد الأشخاص) *</label>
              <Input
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="عدد الأشخاص"
                min={1}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">المميزات (مفصولة بفاصلة)</label>
              <Input
                name="amenities"
                value={formData.amenities.join(", ")}
                onChange={handleAmenitiesChange}
                placeholder="تلفاز, تكييف, واي فاي..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">وصف الغرفة *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف تفصيلي للغرفة"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditSubmit} disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Room Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد حذف الغرفة</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            هل أنت متأكد من رغبتك في حذف غرفة "{currentRoom?.name}"؟
            <br />
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم، حذف الغرفة"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRooms;
