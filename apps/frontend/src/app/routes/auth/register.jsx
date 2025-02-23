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
    email: z.string().email({ message: "Email không hợp lệ." }),
    phone: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 số." })
      .regex(/^\d+$/, { message: "Số điện thoại chỉ chứa chữ số." }),
    address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự." }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
      message: "Confirm Password must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

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
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/path-to-your-restaurant-image.jpg')" }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg bg-opacity-90">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nhập địa chỉ của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
