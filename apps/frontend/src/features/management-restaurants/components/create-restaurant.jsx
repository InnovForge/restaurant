import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SearchLocation from "@/features/address/components/search-location";
import { useState } from "react";
import { ImagePreview } from "@/components/ui/image-preview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRestaurant, uploadRestaurantImage } from "../api/create-restaurant";
import { useCallback } from "react";
import PrivacyPolicy from "./privacy-policy-restaurant";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Tên nhà hàng không được để trống.",
    })
    .min(3, {
      message: "Tên nhà hàng phải có ít nhất 3 ký tự.",
    }),
  phoneNumber: z
    .string({
      required_error: "Số điện thoại không được để trống.",
    })
    .min(10, {
      message: "Số điện thoại phải có ít nhất 10 chữ số.",
    })
    .max(15, {
      message: "Số điện thoại không quá 15 chữ số.",
    })
    .regex(/^[0-9]+$/, {
      message: "Số điện thoại chỉ chứa các chữ số.",
    }),
  email: z
    .string({
      required_error: "Email không được để trống.",
    })
    .email({
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
    avatar: { file: null, preview: null },
    cover: { file: null, preview: null },
  });
  const [terms, setTerms] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageFile, setMessageFile] = useState(null);

  useEffect(() => {
    if (images.avatar.file) {
      setMessageFile(null);
    }
  }, [images.avatar.file]);

  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createRestaurant,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      const newRestaurantId = res.data.data.restaurantId;
      if (images.avatar.file || images.cover.file) {
        uploadImageMutation.mutate({
          restaurantId: newRestaurantId,
          images: {
            avatar: images.avatar.file,
            cover: images.cover.file,
          },
        });
      }
    },

    onError: (err) => {
      if (err.status === 400) {
        const errorData = err.response.data?.errors;
        const errorMessageMap = {
          email: "Email đã tồn tại.",
          phoneNumber: "Số điện thoại đã tồn tại.",
        };
        // console.log(errorData);
        if (errorData) {
          for (const error of errorData) {
            const errMessage = errorMessageMap[error.field] || error.message;
            form.setError(error.field, {
              type: "manual",
              message: errMessage,
            });
          }
        }
      }
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadRestaurantImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      setOpen(true);
    },
    onError: (err) => {
      // alert(`Lỗi upload ảnh: ${err.message}`);
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    if (!images.avatar.file) {
      setMessageFile("Ảnh đại diện không được để trống");
    } else {
      mutate(values);
    }
  }

  const handleImageChange = useCallback((name, file) => {
    setImages((prev) => {
      if (prev[name]?.preview) {
        URL.revokeObjectURL(prev[name].preview);
      }
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        return {
          ...prev,
          [name]: { file, preview: previewUrl },
        };
      }
      return {
        ...prev,
        [name]: { file: null, preview: null },
      };
    });
  }, []);

  const { name, phoneNumber, email, address } = form.watch();
  const { errors, isValid } = form.formState;

  const isFormValid = name?.trim() && phoneNumber?.trim() && email?.trim() && address?.addressLine1 && terms;

  console.log(form.formState.errors);

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger >Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-blue-500">Yêu cầu của bạn đã được gửi đi </AlertDialogTitle>
            <AlertDialogDescription>
              Cảm ơn bạn đã gửi yêu cầu. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                window.location.href = "/d/restaurants";
              }}
            >
              Quay lại trang quản lí nhà hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

          <PrivacyPolicy terms={terms} setTerms={setTerms} />

          {messageFile && <p className="text-red-500 text-center">{messageFile}</p>}
          {Object.keys(errors).length > 0 && (
            <ul className="text-red-500 space-y-1 text-center">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error.message}</li>
              ))}
            </ul>
          )}
          <Button type="submit" className="w-full" disabled={!isFormValid}>
            Gửi yêu cầu
          </Button>
        </form>
      </Form>
    </div>
  );
}
