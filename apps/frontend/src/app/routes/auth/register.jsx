import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";

// Schema kiểm tra đầu vào
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    phone: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 số." })
      .regex(/^\d+$/, { message: "Số điện thoại chỉ chứa chữ số." }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
      message: "Confirm Password must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Gán lỗi vào trường confirmPassword
  });

const Register = () => {
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
    <div className="flex">
      {/* Khu vực hình ảnh */}
      <div className="border-2 border-red-600 w-[60%] h-full">
        <h1>dsjsajkkj</h1>
      </div>

      {/* Khu vực form đăng nhập */}
      <div className="ml-9 mt-40">
        <div className="text-black font-bold text-3xl">{/* <h1>Sign in</h1> */}</div>
        <div>{/* <h6>Please login to continue to your account.</h6> */}</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Tên người dùng */}
            <FormField
              control={form.control}
              name="Tên người dùng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tên đăng nhập */}
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
            {/* Số điện thoại */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Nhập số điện thoại của bạn" {...field} />
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

            {/* Confirm Password Input */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Các lựa chọn giới tính */}
            <div className="flex justify-around w-full max-w-sm">
              <div className="flex items-center space-x-2">
                <input type="radio" id="male" name="gender" value="male" />
                <label
                  htmlFor="male"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nam
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="female" name="gender" value="female" />
                <label
                  htmlFor="female"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nữ
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="other" name="gender" value="other" />
                <label
                  htmlFor="other"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Khác
                </label>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Tạo tài khoản
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
