import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";
import { useState } from "react";

const checkUsernameExists = async (username) => {
  try {
    const res = await api.get(`/v1/auth/check-username?username=${username}`);
    return res.data.exists;
  } catch (error) {
    console.error("Lỗi khi kiểm tra username:", error);
    return false;
  }
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên người có ít nhất 2 ký tự." }),
  username: z.string().min(3, { message: "Tên người dùng phải có ít nhất 3 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." })
    .regex(/[a-zA-Z]/, { message: "Mật khẩu phải chứa ít nhất một chữ cái." })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất một số." }),
  gender: z.union([z.literal(1), z.literal(2), z.literal(9)]).default(1),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "Số điện thoại phải có đúng 10 chữ số." }),
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { gender: 1 },
  });

  const onSubmit = async (value) => {
    setLoading(true);
    try {
      const usernameExists = await checkUsernameExists(value.username);
      if (usernameExists) {
        form.setError("username", { message: "Tên người dùng đã tồn tại!" });
        setLoading(false);
        return;
      }
      const res = await api.post("/v1/auth/register", value);
      if (res.status === 200) {
        console.log("Đăng ký thành công!", res.data);
        form.reset();
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      form.setError("root", { message: error.response?.data?.message || "Có lỗi xảy ra!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} />
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
                    <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4">
                      {[
                        [1, "Nam"],
                        [2, "Nữ"],
                        [9, "Khác"],
                      ].map(([value, label]) => (
                        <label key={value} className="flex items-center space-x-1">
                          <input
                            type="radio"
                            value={value}
                            checked={field.value === value}
                            onChange={() => field.onChange(value)}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && <p className="text-red-500">{form.formState.errors.root.message}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
            <p className="text-center text-blue-500 cursor-pointer mt-4" onClick={() => navigate("/login")}>
              Bạn đã có tài khoản ư?
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
