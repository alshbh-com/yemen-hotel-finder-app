
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  SlidersHorizontal,
  Star,
  Loader2,
  MapPin,
  Filter,
  Bed,
} from "lucide-react";

const amenitiesOptions = [
  { id: "wifi", label: "واي فاي مجاني" },
  { id: "pool", label: "مسبح" },
  { id: "parking", label: "موقف سيارات" },
  { id: "breakfast", label: "إفطار مجاني" },
  { id: "ac", label: "تكييف" },
  { id: "gym", label: "صالة رياضية" },
  { id: "spa", label: "سبا" },
  { id: "restaurant", label: "مطعم" },
];

const Hotels = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    stars: [] as number[],
    priceRange: [0, 5000],
    amenities: [] as string[],
  });
  const [sortBy, setSortBy] = useState("price_asc");
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

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

  const handleStarFilter = (star: number) => {
    setFilters(prev => {
      const starIndex = prev.stars.indexOf(star);
      if (starIndex === -1) {
        return { ...prev, stars: [...prev.stars, star] };
      } else {
        return { ...prev, stars: prev.stars.filter((s) => s !== star) };
      }
    });
  };

  const handleAmenityFilter = (amenity: string) => {
    setFilters(prev => {
      const amenityIndex = prev.amenities.indexOf(amenity);
      if (amenityIndex === -1) {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      } else {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      }
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: values }));
  };

  const handleCityFilter = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      stars: [],
      priceRange: [0, 5000],
      amenities: [],
    });
    setSearchTerm("");
    setSortBy("price_asc");
  };

  const filteredAndSortedHotels = hotels
    .filter((hotel) => {
      // Search term filter
      if (searchTerm && !hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !hotel.city.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // City filter
      if (filters.city && hotel.city !== filters.city) {
        return false;
      }
      
      // Stars filter
      if (filters.stars.length > 0 && !filters.stars.includes(hotel.stars)) {
        return false;
      }
      
      // Price range filter
      if (hotel.price_per_night < filters.priceRange[0] || hotel.price_per_night > filters.priceRange[1]) {
        return false;
      }
      
      // Amenities filter
      if (filters.amenities.length > 0) {
        const hotelAmenities = hotel.amenities || [];
        return filters.amenities.every(amenity => 
          hotelAmenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price_per_night - b.price_per_night;
        case "price_desc":
          return b.price_per_night - a.price_per_night;
        case "rating_desc":
          return (b.rating || 0) - (a.rating || 0);
        case "stars_desc":
          return b.stars - a.stars;
        default:
          return a.price_per_night - b.price_per_night;
      }
    });

  // Get unique cities for filter
  const cities = [...new Set(hotels.map(hotel => hotel.city))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">اكتشف أفضل الفنادق في اليمن</h1>
          <p className="text-gray-600">ابحث وقارن واحجز في أكثر من {hotels.length} فندق في جميع أنحاء اليمن</p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="ابحث عن فندق، مدينة أو منطقة"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="الترتيب حسب" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="price_asc">السعر: من الأقل إلى الأعلى</SelectItem>
                  <SelectItem value="price_desc">السعر: من الأعلى إلى الأقل</SelectItem>
                  <SelectItem value="rating_desc">التقييم: من الأعلى إلى الأقل</SelectItem>
                  <SelectItem value="stars_desc">النجوم: من الأعلى إلى الأقل</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 ml-2" />
                الفلاتر
              </Button>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-4 border-t pt-4">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="city">
                  <AccordionTrigger>المدينة</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          id="all-cities-mobile"
                          name="city-mobile"
                          checked={filters.city === ""}
                          onChange={() => handleCityFilter("")}
                          className="mr-2"
                        />
                        <label htmlFor="all-cities-mobile">جميع المدن</label>
                      </div>
                      {cities.map((city) => (
                        <div key={city} className="flex items-center">
                          <input
                            type="radio"
                            id={`city-${city}-mobile`}
                            name="city-mobile"
                            checked={filters.city === city}
                            onChange={() => handleCityFilter(city)}
                            className="mr-2"
                          />
                          <label htmlFor={`city-${city}-mobile`}>{city}</label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="stars">
                  <AccordionTrigger>التصنيف (النجوم)</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center">
                          <Checkbox
                            id={`star-${star}-mobile`}
                            checked={filters.stars.includes(star)}
                            onCheckedChange={() => handleStarFilter(star)}
                          />
                          <label 
                            htmlFor={`star-${star}-mobile`}
                            className="ml-2 flex items-center"
                          >
                            {star} <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>نطاق السعر</AccordionTrigger>
                  <AccordionContent>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 5000]}
                        value={filters.priceRange}
                        min={0}
                        max={5000}
                        step={100}
                        onValueChange={handlePriceRangeChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm">
                        <span>{filters.priceRange[0]} ر.س</span>
                        <span>{filters.priceRange[1]} ر.س</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="amenities">
                  <AccordionTrigger>وسائل الراحة</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {amenitiesOptions.map((amenity) => (
                        <div key={amenity.id} className="flex items-center">
                          <Checkbox
                            id={`amenity-${amenity.id}-mobile`}
                            checked={filters.amenities.includes(amenity.id)}
                            onCheckedChange={() => handleAmenityFilter(amenity.id)}
                          />
                          <label 
                            htmlFor={`amenity-${amenity.id}-mobile`}
                            className="ml-2"
                          >
                            {amenity.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-4 pt-4 border-t flex justify-between">
                <Button variant="outline" onClick={resetFilters} className="text-sm">
                  إعادة ضبط
                </Button>
                <Button onClick={() => setShowFilters(false)} className="text-sm">
                  عرض النتائج
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-sm h-fit">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Filter className="w-4 h-4 ml-2" />
                الفلاتر
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters} 
                className="w-full text-sm"
              >
                إعادة ضبط الفلاتر
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 ml-2" />
                  المدينة
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="all-cities"
                      name="city"
                      checked={filters.city === ""}
                      onChange={() => handleCityFilter("")}
                      className="mr-2"
                    />
                    <label htmlFor="all-cities">جميع المدن</label>
                  </div>
                  {cities.map((city) => (
                    <div key={city} className="flex items-center">
                      <input
                        type="radio"
                        id={`city-${city}`}
                        name="city"
                        checked={filters.city === city}
                        onChange={() => handleCityFilter(city)}
                        className="mr-2"
                      />
                      <label htmlFor={`city-${city}`}>{city}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3 flex items-center">
                  <Star className="w-4 h-4 ml-2" />
                  التصنيف (النجوم)
                </h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center">
                      <Checkbox
                        id={`star-${star}`}
                        checked={filters.stars.includes(star)}
                        onCheckedChange={() => handleStarFilter(star)}
                      />
                      <label 
                        htmlFor={`star-${star}`}
                        className="ml-2 flex items-center"
                      >
                        {star} <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3">نطاق السعر</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 5000]}
                    value={filters.priceRange}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={handlePriceRangeChange}
                    className="mb-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{filters.priceRange[0]} ر.س</span>
                    <span>{filters.priceRange[1]} ر.س</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3 flex items-center">
                  <Bed className="w-4 h-4 ml-2" />
                  وسائل الراحة
                </h4>
                <div className="space-y-2">
                  {amenitiesOptions.map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={filters.amenities.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityFilter(amenity.id)}
                      />
                      <label 
                        htmlFor={`amenity-${amenity.id}`}
                        className="ml-2"
                      >
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Hotel Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAndSortedHotels.length === 0 ? (
              <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">لا توجد نتائج</h3>
                <p className="text-gray-500 mb-6">
                  لا توجد فنادق تطابق معايير البحث الخاصة بك. حاول تعديل الفلاتر أو البحث بمصطلح آخر.
                </p>
                <Button onClick={resetFilters}>إعادة ضبط الفلاتر</Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">{filteredAndSortedHotels.length} فندق</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      id={hotel.id}
                      name={hotel.name}
                      location={`${hotel.city}، ${hotel.country}`}
                      price={hotel.price_per_night}
                      rating={hotel.rating || 0}
                      imageUrl={hotel.images && hotel.images.length > 0 ? hotel.images[0] : ""}
                      amenities={hotel.amenities || []}
                      featured={hotel.featured}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Hotels;
