import { useState } from "react";
import logo from "../../../assets/react.svg";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { api } from "@/lib/api-client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SearchLocation from "@/features/address/components/search-location";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

export const uploadAvatar = async (image) => {
  const formData = new FormData();
  console.log("imageUsêr", image);
  if (image) {
    formData.append("avatar", image);
  }

  return api.patch(`v1/users/me/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const Me = () => {
  const [editingIndex, setEditingIndex] = useState(null);

  const { authUser } = useAuthUserStore();

  console.log(authUser);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(authUser.name);
  const [phone, setPhone] = useState("0123456789");
  const [email, setEmail] = useState(authUser.email);
  const [addresses, setAddresses] = useState(authUser.addresses);
  const [avatar, setAvatar] = useState(authUser.avatarUrl);
  const [addF, setAddFile] = useState(null);
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const updateUserMutation = useMutation({
    mutationFn: () =>
      api.patch("v1/users/me", {
        name,
        email,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("update-user");
      alert("Cập nhật thông tin thành công");
    },
  });

  const updateaddressesMutation = useMutation({
    mutationFn: ({ id, data }) => {
      api.patch(`v1/users/me/addresses/${id}`, data);
      console.log("on f", id, data);
    },
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries("update-addresses-user"); // Cập nhật cache
      setAddresses((prev) => prev.map((addr) => (addr.addressId === id ? { ...addr, ...data } : addr)));
      setEditingIndex(null); // Đóng form sau khi cập nhật
      alert("Cập nhật địa chỉ thành công");
    },
  });

  const deleteddressesMutation = useMutation({
    mutationFn: (id) => api.delete(`v1/users/me/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries("delete-addresses-user");
      alert("Xoá thông tin thành công");
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: ({ data }) => api.post("v1/users/me/addresses", data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries("create-addresses-user");
      setAddresses((prev) => [...prev, data]);
      setIsAdding(false);
      alert("Thêm địa chỉ thành công");
    },
  });

  const updateUserAvatar = useMutation({
    mutationFn: () => uploadAvatar(addF),
    onSuccess: () => {
      queryClient.invalidateQueries("update-user-avatar");
      alert("Cập nhật avatar thành công");
    },
  });
  const handleSave = () => {
    console.log("Save");
    setIsEditing(false);
    // Thêm logic cập nhật dữ liệu lên server nếu cần
    console.log("test");

    // onSubmit();

    updateUserMutation.mutate();
    if (avatar) {
      updateUserAvatar.mutate();
    }

    // onSubmit(value);
    // console.log("test");
    // console.log("hello", value);
  };

  const addAddress = () => {
    // setAddresses([...addresses, { ward: "", district: "", city: "", country: "" }]);
  };

  const removeAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const updateAddress = (index, field, value) => {
    const newAddresses = addresses.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr));
    setAddresses(newAddresses);
  };

  const formSchema = z.object({
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

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    // mutate(values);
    console.log("values");
    console.log(values.address);
    if (isAdding) {
      createAddressMutation.mutate({ data: { ...values.address, phoneNumber: "09999999999", isDefault: true } });
    } else {
      updateaddressesMutation.mutate({ id: adressTd, data: values.address });
    }

    // setAddresses();
    // form.reset();

    console.log(addresses);
  }
  const addFile = (event) => {
    setAddFile(event.target.files[0]);
  };
  const [adressTd, setAdressId] = useState();
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Thông Tin Người Dùng</h2>
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <img src={avatar || logo} alt="Avatar" className="w-24 h-24 rounded-full mb-2 border" />
          {isEditing && (
            <input
              type="file"
              onChange={(e) => {
                setAvatar(URL.createObjectURL(e.target.files[0]));
                addFile(e);
              }}
              className="text-sm"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-600">Tên:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-xl font-semibold">{name}</h1>
          )}
        </div>
        {/* <div>
          <label className="block text-gray-600">Số điện thoại:</label>
          {isEditing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-xl font-semibold">{phone}</h1>
          )}
        </div> */}
        {/* <div>
          <label className="block text-gray-600">Ngày sinh:</label>
          {isEditing ? (
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <h1 className="text-xl font-semibold">{birthDate || "Chưa có email"}</h1>
          )}
        </div> */}
        <div>
          <label className="block text-gray-600">Email:</label>
          {isEditing ? (
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h1 className="text-xl font-semibold">{email || "Chưa có email"}</h1>
          )}
        </div>
        <div>
          <label className="block text-gray-600">Địa chỉ:</label>
          {addresses?.map((addr, index) => (
            <div key={index} className="border p-2 mb-2 rounded-lg">
              {isEditing ? (
                <>
                  {editingIndex === index ? (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit((data) => {
                          onSubmit(data);
                          setEditingIndex(null); // Thoát chế độ chỉnh sửa sau khi gửi form
                        })}
                        className="space-y-3"
                      >
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            console.log("f", field),
                            (
                              <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                  <div>
                                    <SearchLocation onChange={field.onChange} value={field.formatted} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          )}
                        />
                        <Button onClick={() => setAdressId(addr.addressId)} type="submit" className="w-full none">
                          Gửi yêu cầu
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <>
                      <h1 className="text-xl font-semibold">{`${addr.addressLine1}, ${addr.addressLine2}`}</h1>
                      <div className="flex space-x-2">
                        <button className="text-red-500 mt-2" onClick={() => setEditingIndex(index)}>
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            removeAddress(index);
                            console.log("x", addr);
                            deleteddressesMutation.mutate(addr.addressId);
                          }}
                          className="text-red-500 mt-2"
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}

                  {/* </div> */}
                </>
              ) : (
                <h1 className="text-xl font-semibold">{`${addr.addressLine1}, ${addr.addressLine2}`}</h1>
              )}
            </div>
          ))}

          {/* {isEditing && <button onClick={addAddress} className="text-blue-500 mt-2">Thêm địa chỉ</button>} */}
          <Button onClick={() => setIsAdding(true)} className="w-full mt-2">
            Thêm địa chỉ
          </Button>
        </div>
        {isAdding && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <SearchLocation onChange={field.onChange} value={field.formatted} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button onClick={() => setAddresses()} type="submit" className="w-full">
                Lưu địa chỉ
              </Button>
              <Button onClick={() => setIsAdding(false)} className="w-full bg-gray-400 mt-2">
                Hủy
              </Button>
            </form>
          </Form>
        )}

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          // type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          {isEditing ? "Lưu" : "Sửa"}
        </button>
      </div>
    </div>
  );
};

export default Me;
