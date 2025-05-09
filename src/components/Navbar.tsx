
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, Globe, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Hotel className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">فندقي</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
          <Link to="/" className="px-3 py-2 text-sm font-medium hover:text-primary">
            الرئيسية
          </Link>
          <Link to="/hotels" className="px-3 py-2 text-sm font-medium hover:text-primary">
            الفنادق
          </Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium hover:text-primary">
            عن التطبيق
          </Link>
          <Link to="/contact" className="px-3 py-2 text-sm font-medium hover:text-primary">
            اتصل بنا
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Globe className="w-5 h-5" />
          </Button>
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              تسجيل الدخول
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/hotels"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الفنادق
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              عن التطبيق
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              اتصل بنا
            </Link>
            <Link
              to="/login"
              className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
