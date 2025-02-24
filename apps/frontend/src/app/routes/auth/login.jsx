import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";

// Schema kiểm tra đầu vào
const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // Hàm xử lý khi submit form
  const onSubmit = async (value) => {
    try {
      const res = await api.post("/v1/auth/login", value);
      if (res.status === 200) {
        window.location.href = "/home";
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Khu vực hình ảnh */}
      <div className="">
        <img
          src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/8/23/1084128/Isushi.jpeg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Khu vực form đăng nhập */}
      <div className="flex w-[40%] justify-center items-center">
        {/* Thêm 1 div để bọc nội dung form */}
        <div className="w-full max-w-md mx-auto px-6">
          <div className="text-black font-bold text-3xl mb-2">
            <h1>Sign in</h1>
          </div>
          <div className="mb-4">
            <h6>Please login to continue to your account.</h6>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Input */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Checkbox "Keep me logged in" */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me logged in
                </label>
              </div>
              {/* Nút đăng nhập */}
              <div className="text-center">
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>
              {/* Hoặc đăng nhập bằng Google */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              <button
                type="button"
                className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Sign in with Google
              </button>
              <div>
                <p className="text-gray-600">
                  Need an account?{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Create one
                  </a>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
