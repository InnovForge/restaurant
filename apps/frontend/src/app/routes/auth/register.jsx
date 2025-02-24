import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";

// Định nghĩa schema kiểm tra đầu vào bằng Zod
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Tên người có ít nhất 2 ký tự.",
    }),
    username: z.string().min(2, {
      message: "Tên người dùng phải có ít nhất 2 ký tự.",
    }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    phone: z
      .string()
      .min(10, { message: "Số điện thoại phải có ít nhất 10 chữ số." })
      .regex(/^\d+$/, { message: "Số điện thoại chỉ được chứa chữ số." }),
    password: z.string().min(2, {
      message: "Mật khẩu phải có ít nhất 2 ký tự.",
    }),
    confirmPassword: z.string().min(2, {
      message: "Xác nhận mật khẩu phải có ít nhất 2 ký tự.",
    }),
    gender: z.enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Vui lòng chọn giới tính." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp.",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // Xử lý khi gửi biểu mẫu
  const onSubmit = async (value) => {
    try {
      const res = await api.post("/v1/auth/register", value);
      if (res.status === 200) {
        window.location.href = "/home";
      }
    } catch (error) {
      console.log("Lỗi khi đăng ký:", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://ezcloud.vn/wp-content/uploads/2024/06/khong-gian-ben-trong-nha-hang-anchor.webp')",
      }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg bg-opacity-90">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Trường nhập Tên  */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Trường nhập Tên người dùng */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người dùng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người dùng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trường nhập Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trường nhập Số điện thoại */}
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

            {/* Trường nhập Mật khẩu */}
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

            {/* Trường nhập Xác nhận mật khẩu */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Xác nhận mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chọn Giới tính */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          value="male"
                          checked={field.value === "male"}
                          onChange={() => field.onChange("male")}
                        />
                        <span>Nam</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          value="female"
                          checked={field.value === "female"}
                          onChange={() => field.onChange("female")}
                        />
                        <span>Nữ</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          value="other"
                          checked={field.value === "other"}
                          onChange={() => field.onChange("other")}
                        />
                        <span>Khác</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút gửi biểu mẫu */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Đăng ký
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
