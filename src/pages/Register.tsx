
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hotel, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !firstName || !lastName) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم تسجيلك بنجاح. قم بتسجيل الدخول للمتابعة.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "فشل إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء محاولة إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing up with Google:", error);
      toast({
        title: "فشل إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء محاولة التسجيل باستخدام Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <Hotel className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">فندقي</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-center">
              أدخل بياناتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="الاسم الأول"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pr-10"
                    dir="rtl"
                  />
                </div>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="الاسم الأخير"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pr-10"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                  dir="rtl"
                />
              </div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  dir="rtl"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSignUpWithGoogle}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 ml-2" />
              التسجيل باستخدام Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-primary hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
