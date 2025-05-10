
import HomeHero from "@/components/HomeHero";
import FeaturedHotels from "@/components/FeaturedHotels";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bed, MapPin, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <HomeHero />

      <main>
        {/* Featured Hotels */}
        <FeaturedHotels />

        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">لماذا تختارنا؟</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Bed className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">مجموعة واسعة من الفنادق</h3>
                <p className="text-gray-600 text-sm">
                  نوفر لك مجموعة كبيرة من الخيارات المتنوعة التي تناسب جميع الميزانيات والاحتياجات
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">مواقع مميزة</h3>
                <p className="text-gray-600 text-sm">
                  اختر من بين الفنادق في أفضل المواقع في جميع أنحاء اليمن
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">دفع آمن</h3>
                <p className="text-gray-600 text-sm">
                  استمتع بطرق دفع آمنة ومتنوعة تضمن سرية معلوماتك
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">دعم على مدار الساعة</h3>
                <p className="text-gray-600 text-sm">
                  فريق دعم متخصص جاهز لمساعدتك في أي وقت
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              استمتع بتجربة حجز سلسة وموثوقة
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              انضم إلى الآلاف من العملاء الراضين واحجز إقامتك الآن في أفضل الفنادق في اليمن
            </p>
            <Button 
              variant="secondary"
              size="lg"
              asChild
            >
              <a href="/hotels">استكشف الفنادق</a>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
