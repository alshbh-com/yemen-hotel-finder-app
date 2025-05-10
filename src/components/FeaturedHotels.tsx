
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import HotelCard from "./HotelCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const FeaturedHotels = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("featured", true)
        .order('rating', { ascending: false })
        .limit(4);

      if (error) throw error;
      setHotels(data || []);
    } catch (error: any) {
      console.error("Error fetching featured hotels:", error);
      setError(error.message);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الفنادق المميزة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchFeaturedHotels();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse">
              <div className="h-40 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الفنادق المميزة</p>
          <Button onClick={handleRetry} variant="outline">
            إعادة المحاولة
          </Button>
        </div>
      );
    }

    if (hotels.length === 0) {
      return <p className="text-center text-gray-500">لا توجد فنادق مميزة حالياً</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            id={hotel.id}
            name={hotel.name}
            location={`${hotel.city}، ${hotel.country}`}
            price={hotel.price_per_night}
            rating={hotel.rating || 0}
            imageUrl={hotel.images && hotel.images.length > 0 ? hotel.images[0] : "/placeholder.svg"}
            amenities={hotel.amenities || []}
            featured={hotel.featured}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">الفنادق المميزة</h2>
        <Button variant="ghost" asChild>
          <a href="/hotels" className="text-primary hover:underline">
            عرض جميع الفنادق
          </a>
        </Button>
      </div>
      {renderContent()}
    </section>
  );
};

export default FeaturedHotels;
