
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Hotel, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً بك مجدداً ${data.user.email}`,
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول باستخدام Google",
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
            <CardTitle className="text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              قم بتسجيل الدخول للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
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
                <div className="text-left">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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
              onClick={handleLoginWithGoogle}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 ml-2" />
              تسجيل الدخول باستخدام Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{" "}
              <Link to="/register" className="text-primary hover:underline">
                إنشاء حساب جديد
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

export default Login;
