
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pen,
  Trash2,
  Plus,
  Star,
  Search,
  Loader2,
  Image,
  Upload,
} from "lucide-react";
import { Hotels } from "@/types/hotel";
import { Label } from "@/components/ui/label";

const AdminHotels = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<any>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "اليمن",
    price_per_night: 0,
    stars: 1,
    amenities: [] as string[],
    featured: false,
    images: [] as string[],
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setHotels(data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الفنادق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "price_per_night") {
      // تأكد من أن القيمة هي رقم صحيح وليست NaN
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // تم تعديل طريقة إضافة الخدمات للسماح بالمسافات
  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const amenitiesList = value.split("\n").map(item => item.trim()).filter(item => item);
    setFormData({
      ...formData,
      amenities: amenitiesList,
    });
  };

  const openAddDialog = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      city: "",
      country: "اليمن",
      price_per_night: 0,
      stars: 1,
      amenities: [],
      featured: false,
      images: [],
    });
    setPreviewImages([]);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (hotel: any) => {
    setCurrentHotel(hotel);
    setFormData({
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      price_per_night: hotel.price_per_night || 0,
      stars: hotel.stars,
      amenities: hotel.amenities || [],
      featured: hotel.featured || false,
      images: hotel.images || [],
    });
    setPreviewImages(hotel.images || []);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (hotel: any) => {
    setCurrentHotel(hotel);
    setIsDeleteDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploadingImage(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `hotel-images/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('hotels')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء رفع الصورة",
            variant: "destructive",
          });
          continue;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('hotels')
          .getPublicUrl(filePath);
          
        if (publicUrlData) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, publicUrlData.publicUrl]
          }));
          setPreviewImages(prev => [...prev, publicUrlData.publicUrl]);
        }
      }
      
      toast({
        title: "تم بنجاح",
        description: "تم رفع الصور بنجاح",
      });
      
      // مسح الملفات المحددة بعد الرفع
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error in file upload:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الصور",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSubmit = async () => {
    try {
      setFormSubmitting(true);
      
      if (!formData.name || !formData.description || !formData.city || formData.price_per_night <= 0) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("hotels")
        .insert([{
          name: formData.name,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          price_per_night: formData.price_per_night,
          stars: formData.stars,
          amenities: formData.amenities,
          featured: formData.featured,
          images: formData.images,
        }])
        .select();
        
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الفندق بنجاح",
      });
      
      setIsAddDialogOpen(false);
      fetchHotels();
    } catch (error) {
      console.error("Error adding hotel:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الفندق",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setFormSubmitting(true);
      
      if (!formData.name || !formData.description || !formData.city || formData.price_per_night <= 0) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("hotels")
        .update({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          price_per_night: formData.price_per_night,
          stars: formData.stars,
          amenities: formData.amenities,
          featured: formData.featured,
          images: formData.images,
        })
        .eq("id", currentHotel.id)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الفندق بنجاح",
      });
      
      setIsEditDialogOpen(false);
      fetchHotels();
    } catch (error) {
      console.error("Error updating hotel:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات الفندق",
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
        .from("hotels")
        .delete()
        .eq("id", currentHotel.id);
        
      if (error) throw error;
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف الفندق بنجاح",
      });
      
      setIsDeleteDialogOpen(false);
      fetchHotels();
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الفندق",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الفنادق</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="البحث عن فندق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Button onClick={openAddDialog}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة فندق جديد
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">
            {searchTerm ? "لا توجد نتائج مطابقة لبحثك" : "لم يتم إضافة أي فنادق بعد"}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>السعر/ليلة</TableHead>
                <TableHead>مميز</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell>
                    {hotel.images && hotel.images.length > 0 ? (
                      <img 
                        src={hotel.images[0]} 
                        alt={hotel.name} 
                        className="h-10 w-14 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-14 bg-gray-200 flex items-center justify-center rounded">
                        <Image className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell>{hotel.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {hotel.stars}
                      <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                  </TableCell>
                  <TableCell>{hotel.price_per_night} ر.س</TableCell>
                  <TableCell>
                    {hotel.featured ? (
                      <span className="text-green-600">نعم</span>
                    ) : (
                      <span className="text-gray-400">لا</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(hotel)}>
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(hotel)}>
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
      
      {/* Add Hotel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة فندق جديد</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">اسم الفندق *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="اسم الفندق"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">المدينة *</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="المدينة"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">البلد</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="البلد"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">العنوان</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="العنوان التفصيلي"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">السعر لليلة الواحدة *</Label>
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
              <Label className="text-sm font-medium">التصنيف (عدد النجوم) *</Label>
              <Input
                name="stars"
                type="number"
                value={formData.stars}
                onChange={handleInputChange}
                placeholder="عدد النجوم"
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">وسائل الراحة</Label>
              <Textarea
                name="amenities"
                value={formData.amenities.join("\n")}
                onChange={handleAmenitiesChange}
                placeholder="أدخل كل ميزة في سطر منفصل
مثال:
واي فاي مجاني
مسبح
موقف سيارات
إفطار مجاني"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">أدخل كل ميزة في سطر جديد</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">وصف الفندق *</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف تفصيلي للفندق"
                rows={4}
              />
            </div>
            
            {/* إضافة قسم رفع الصور */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">صور الفندق</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">اضغط لاختيار الصور</p>
                  <p className="text-xs text-gray-400">يمكنك اختيار أكثر من صورة</p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="hotel-images"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الرفع...
                      </>
                    ) : (
                      "اختر الصور"
                    )}
                  </Button>
                </div>
              </div>
              
              {/* معاينة الصور */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">الصور المختارة</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Hotel image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <Label htmlFor="featured" className="text-sm font-medium">
                فندق مميز
              </Label>
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
                "إضافة الفندق"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Hotel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الفندق</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">اسم الفندق *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="اسم الفندق"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">المدينة *</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="المدينة"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">البلد</Label>
              <Input
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="البلد"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">العنوان</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="العنوان التفصيلي"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">السعر لليلة الواحدة *</Label>
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
              <Label className="text-sm font-medium">التصنيف (عدد النجوم) *</Label>
              <Input
                name="stars"
                type="number"
                value={formData.stars}
                onChange={handleInputChange}
                placeholder="عدد النجوم"
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">وسائل الراحة</Label>
              <Textarea
                name="amenities"
                value={formData.amenities.join("\n")}
                onChange={handleAmenitiesChange}
                placeholder="أدخل كل ميزة في سطر منفصل"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">أدخل كل ميزة في سطر جديد</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">وصف الفندق *</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="وصف تفصيلي للفندق"
                rows={4}
              />
            </div>
            
            {/* إضافة قسم رفع الصور */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">صور الفندق</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">اضغط لاختيار الصور</p>
                  <p className="text-xs text-gray-400">يمكنك اختيار أكثر من صورة</p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="hotel-images-edit"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الرفع...
                      </>
                    ) : (
                      "اختر الصور"
                    )}
                  </Button>
                </div>
              </div>
              
              {/* معاينة الصور */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">الصور المختارة</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Hotel image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="editFeatured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <Label htmlFor="editFeatured" className="text-sm font-medium">
                فندق مميز
              </Label>
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
      
      {/* Delete Hotel Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد حذف الفندق</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            هل أنت متأكد من رغبتك في حذف فندق "{currentHotel?.name}"؟
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
                "نعم، حذف الفندق"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHotels;
