
import { Hotel, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold text-primary">فندقي</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              تطبيق متخصص في حجوزات الفنادق في اليمن، يوفر لك أفضل العروض وأسهل طريقة للحجز.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-primary">الرئيسية</a>
              </li>
              <li>
                <a href="/hotels" className="text-sm text-gray-600 hover:text-primary">استكشاف الفنادق</a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-600 hover:text-primary">عن التطبيق</a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-600 hover:text-primary">اتصل بنا</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-bold mb-4">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-sm text-gray-600 hover:text-primary">الأسئلة المتكررة</a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-600 hover:text-primary">شروط الاستخدام</a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-600 hover:text-primary">سياسة الخصوصية</a>
              </li>
              <li>
                <a href="/help" className="text-sm text-gray-600 hover:text-primary">مركز المساعدة</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-primary mt-1 ml-2" />
                <span className="text-sm text-gray-600">صنعاء، اليمن</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-primary ml-2" />
                <span className="text-sm text-gray-600" dir="ltr">+967 1 234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-primary ml-2" />
                <span className="text-sm text-gray-600">info@fundoqi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} فندقي - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
