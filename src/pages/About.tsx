
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Hotel, Globe, Users, Star, Phone, Mail } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">عن تطبيق فندقي</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Hotel className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <p className="text-lg mb-6 leading-relaxed">
              مرحبًا بكم في تطبيق "فندقي"، منصتكم المتكاملة لحجز الفنادق في اليمن. يهدف تطبيقنا إلى تسهيل عملية البحث والحجز للإقامة في أفضل الفنادق المتاحة في مختلف المدن اليمنية.
            </p>
            
            <p className="text-lg mb-8 leading-relaxed">
              نحن نسعى لتقديم تجربة سلسة وممتعة لمستخدمينا، مع توفير معلومات دقيقة وشاملة عن كل فندق، والغرف المتاحة، والخدمات المقدمة، والأسعار التنافسية.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">ما يميزنا</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 mt-1">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div className="mr-4">
                  <h3 className="font-bold text-lg mb-1">تغطية واسعة</h3>
                  <p className="text-gray-600">نوفر خدمات الحجز في جميع المدن اليمنية الرئيسية</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="mr-4">
                  <h3 className="font-bold text-lg mb-1">خدمة عملاء متميزة</h3>
                  <p className="text-gray-600">فريق دعم متخصص جاهز لمساعدتكم على مدار الساعة</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 mt-1">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div className="mr-4">
                  <h3 className="font-bold text-lg mb-1">تقييمات حقيقية</h3>
                  <p className="text-gray-600">تقييمات وآراء من نزلاء حقيقيين لمساعدتك في اختيار الأفضل</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 mt-1">
                  <Hotel className="h-5 w-5 text-primary" />
                </div>
                <div className="mr-4">
                  <h3 className="font-bold text-lg mb-1">تنوع الخيارات</h3>
                  <p className="text-gray-600">مجموعة متنوعة من الفنادق لتناسب جميع الميزانيات والاحتياجات</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">تواصل معنا</h2>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 ml-2 text-primary" />
                <span>+967 1234567890</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 ml-2 text-primary" />
                <span>info@funduqi.ye</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
