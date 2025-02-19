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
        navigate("/home");
      }
    } catch (error) {
      console.log("err", error);
    }
    //   values.preventDefault();
  };

  return (
    <div className="flex">
      {/* Khu vực hình ảnh */}
      <div className="border-2 border-red-600 w-[60%] h-full">
        <img src="https://d15duu1h3gsd2d.cloudfront.net/Pictures/1024x536/1/3/0/161130_pub_843494_crop.jpg" alt="" />
      </div>

      {/* Khu vực form đăng nhập */}
      <div className="ml-9 mt-36">
        <div className="text-black font-bold text-3xl">
          <h1>Sign in</h1>
        </div>
        <div>
          <h6>Plese login to continue to your account.</h6>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            </div>{" "}
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
  );
};

export default Login;
