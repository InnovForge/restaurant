import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";

// Schema kiểm tra đầu vào
const formSchema = z.object({
  username: z.string().min(2, { message: "Vui lòng nhập tên đăng nhập." }),
  password: z.string().min(2, { message: "Vui lòng nhập mật khẩu." }),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(formSchema) });

  // Hàm xử lý khi submit form
  const onSubmit = async (value) => {
    try {
      const res = await api.post("/v1/auth/login", value);
      if (res.status === 200) {
        window.location.href = "/home";
      }
    } catch (error) {
      form.setError("username", { message: "Tên đăng nhập hoặc mật khẩu không đúng." });
      form.setError("password", { message: "Tên đăng nhập hoặc mật khẩu không đúng." });
      console.log("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Khu vực hình ảnh */}
      <div>
        <img
          src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/8/23/1084128/Isushi.jpeg"
          alt="Hình ảnh minh họa"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Khu vực form đăng nhập */}
      <div className="flex w-[40%] justify-center items-center">
        <div className="w-full max-w-md mx-auto px-6">
          <h1 className="text-black font-bold text-3xl mb-2">Đăng nhập</h1>
          <h6 className="mb-4">Vui lòng đăng nhập để tiếp tục.</h6>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Input */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên đăng nhập" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkbox "Ghi nhớ đăng nhập"
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none">
                  Ghi nhớ đăng nhập
                </label>
              </div> */}
              {/* Nút đăng nhập */}
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              {/* Hoặc đăng nhập bằng Google */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500">hoặc</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              {/* Điều hướng đến trang đăng ký */}
              <p className="text-gray-600 text-center mt-4">
                Bạn chưa có tài khoản?{" "}
                <span onClick={() => navigate("/register")} className="text-blue-500 hover:underline cursor-pointer">
                  Đăng ký
                </span>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
