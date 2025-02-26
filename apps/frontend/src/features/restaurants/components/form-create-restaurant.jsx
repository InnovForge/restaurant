import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SearchLocation from "@/features/address/components/search-location";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ImagePreview } from "@/components/ui/image-preview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRestaurant, uploadRestaurantImage } from "../api/create-restaurant";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Tên nhà hàng phải có ít nhất 3 ký tự.",
  }),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Số điện thoại phải có ít nhất 10 chữ số.",
    })
    .regex(/^[0-9]+$/, {
      message: "Số điện thoại chỉ chứa các chữ số.",
    }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  address: z.object(
    {
      latitude: z.any(),
      longitude: z.any(),
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
    },
    {
      message: "Địa chỉ không được để trống",
    },
  ),
});

export function RestaurantForm() {
  const [images, setImages] = useState({
    avatar: { file: null, preview: "" },
    cover: { file: null, preview: "" },
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (res) => {
      // Refetch lại danh sách nhà hàng để cập nhật giao diện
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      const newRestaurantId = res.data.data.restaurantId;
      alert("Tạo nhà hàng thành công!");

      // Tiếp tục upload ảnh
      if (images.avatar.file || images.cover.file) {
        uploadImageMutation.mutate({
          restaurantId: newRestaurantId,
          images: {
            avatar: images.avatar.file,
            cover: images.cover.file,
          },
        });
      }
      // setFormData({ name: "", address: "", phone: "" });
    },
    onError: (err) => {
      alert(`Lỗi: ${err.message}`);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadRestaurantImage,
    onSuccess: () => {
      alert("Upload ảnh thành công!");
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      // setFormData({ name: "", address: "", phone: "" });
      // setImageFile(null);
    },
    onError: (err) => {
      alert(`Lỗi upload ảnh: ${err.message}`);
    },
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    console.log(values);
    mutate(values);

    // const formData = new FormData();
    // if (images.avatar) {
    // 	formData.append("avatar", images.avatar.file);
    // }
    //
    // if (images.cover) {
    // 	formData.append("cover", images.cover.file);
    // }
    // console.log(formData);
  }

  const handleImageChange = (name, file) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => ({
        ...prev,
        [name]: { file, preview: previewUrl },
      }));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex md:block flex-col gap-2 relative ">
          <div className="md:absolute z-10 right-5 mx-auto bottom-10 md:translate-y-1/2">
            <ImagePreview
              name="avatar"
              value={images.avatar.preview}
              onChange={handleImageChange}
              aspectRatio="avatar"
              className="md:max-w-40 max-w-24"
            />
          </div>
          <ImagePreview
            name="cover"
            value={images.cover.preview}
            onChange={handleImageChange}
            className="max-w-full"
            aspectRatio="cover"
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhà hàng</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
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
                <Input placeholder="" {...field} />
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
                <div>
                  <SearchLocation {...field} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Đồng ý với điều khoản và dịch vụ</Label>
        </div>
        <Button type="submit" className="w-full">
          Gửi yêu cầu
        </Button>
      </form>
    </Form>
  );
}
