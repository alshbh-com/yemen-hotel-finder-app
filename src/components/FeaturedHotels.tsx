
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HotelCard from "./HotelCard";

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const { data, error } = await supabase
          .from("hotels")
          .select("*")
          .eq("featured", true)
          .limit(4);

        if (error) throw error;
        setHotels(data || []);
      } catch (error: any) {
        console.error("Error fetching featured hotels:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات الفنادق المميزة",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">الفنادق المميزة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">الفنادق المميزة</h2>
      {hotels.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد فنادق مميزة حالياً</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
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
      )}
    </div>
  );
};

export default FeaturedHotels;
