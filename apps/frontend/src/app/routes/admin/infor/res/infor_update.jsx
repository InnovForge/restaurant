import { useState, useEffect, useCallback } from "react";
import { MapPin, Mail, Phone, Upload, Camera, MapPinned, ArrowLeft, Save, Trash2, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { api } from "@/lib/api-client";
import { toast } from "sonner";

import { Link } from "react-router";

import { useUserRestaurants } from "@/hooks/use-user-restaurants";
import { uploadRestaurantImage } from "@/features/restaurants/api/create-restaurant";
import { useRestaurant } from "@/context/restaurant";

export default function RestaurantUpdateInfoForm() {
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { restaurantId } = useRestaurant();

  const resT = useUserRestaurants();

  useEffect(() => {
    if (resT.data && resT.data.length > 0) {
      setRestaurantInfo(resT.data[0]);
      // test
      // console.log("infores", restaurantInfo)
      console.log(resT.data[0]);
      setLoading(false);
    }
  }, [resT.data]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
  });

  useEffect(() => {
    if (restaurantInfo) {
      setFormData({
        name: restaurantInfo.restaurantName || "",
        email: restaurantInfo.email || "",
        phoneNumber: restaurantInfo.phoneNumber || "",
        addressLine1: restaurantInfo.addressLine1 || "",
        addressLine2: restaurantInfo.addressLine2 || "",
      });
    }
  }, [restaurantInfo]);

  //
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const [images, setImages] = useState({
    avatar: { file: null, preview: null },
    cover: { file: null, preview: null },
  });

  useEffect(() => {
    if (restaurantInfo) {
      setImages({
        avatar: {
          file: null,
          preview: restaurantInfo.logoUrl || null,
        },
        cover: {
          file: null,
          preview: restaurantInfo.coverUrl || null,
        },
      });
    }
  }, [restaurantInfo]);

  const handleImageChange = useCallback(
    (name, e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        // toast({
        //   title: "Lỗi",
        //   description: "Kích thước ảnh không được vượt quá 5MB",
        //   variant: "destructive",
        // })
        toast("Lỗi", {
          description: "Kích thước ảnh không được vượt quá 5MB",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        return;
      }

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        // toast ({
        //   title: "Lỗi",
        //   description: "Vui lòng chọn file ảnh hợp lệ",
        //   variant: "destructive",
        // })
        toast("Lỗi", {
          description: "Vui lòng chọn file ảnh hợp lệ",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        return;
      }

      setImages((prev) => {
        if (prev[name]?.preview && prev[name]?.file) {
          URL.revokeObjectURL(prev[name].preview);
        }

        return {
          ...prev,
          [name]: {
            file,
            preview: URL.createObjectURL(file),
          },
        };
      });
    },
    [toast],
  );

  const removeImage = useCallback((name) => {
    setImages((prev) => {
      if (prev[name]?.preview && prev[name]?.file) {
        URL.revokeObjectURL(prev[name].preview);
      }

      return {
        ...prev,
        [name]: {
          file: null,
          preview: null,
        },
      };
    });
  }, []);

  // Xử lý cập nhật thông tin
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const updatedData = {
        name: formData.name,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
        },
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      };
      // const updatedImages = {
      //   avatar: images.avatar.file,
      //   cover: images.cover.file,
      // }
      // // Giả lập API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      const updatedImages = {
        avatar: images.avatar.file,
        cover: images.cover.file,
      };
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await api.patch(`/v1/restaurants/${restaurantId}`, updatedData);
      const resImages = await uploadRestaurantImage({ restaurantId, images: updatedImages });
      if (resImages) {
        toast({
          title: " Cập nhật ảnh thành công",
          description: "Cập nhật ảnh thông tin nhà hàng thành công",
        });
      }
      toast("Thành công", {
        description: "Cập nhật thông tin nhà hàng thành công",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      setRestaurantInfo(res.data[0]);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      // toast ({
      //   title: "Lỗi",
      //   description: err.response?.data?.message || "Cập nhật thất bại",
      //   variant: "destructive",
      // })
      toast("Lỗi cập nhật", {
        description: err.response?.data?.message || "Cập nhật thất bại",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link to={`/d/restaurants/${restaurantInfo?.restaurantId}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Cập nhật thông tin nhà hàng</h1>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Thông tin nhà hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                      Tên nhà hàng
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên nhà hàng"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@domain.com"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-base font-medium">
                      Điện thoại
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="0123456789"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1" className="text-base font-medium">
                      Địa chỉ
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="Số nhà, tên đường"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2" className="text-base font-medium">
                      Khu vực
                    </Label>
                    <div className="relative">
                      <MapPinned className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Quận/Huyện, Tỉnh/Thành phố"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-2">
              <Button variant="outline" asChild>
                <Link to={`/d/restaurants/${restaurantInfo?.restaurantId}`}>Hủy</Link>
              </Button>
              <Button onClick={handleUpdate} disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Hình ảnh nhà hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Logo nhà hàng</h3>
                <div className="flex items-start gap-6">
                  <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {images.avatar.preview ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={images.avatar.preview || "/placeholder.svg"}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImage("avatar")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Chưa có logo</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Tải lên logo của nhà hàng. Khuyến nghị sử dụng hình ảnh vuông, kích thước tối thiểu 400x400px.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("avatar-upload").click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Tải lên logo
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange("avatar", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Ảnh bìa</h3>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {images.cover.preview ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={images.cover.preview || "/placeholder.svg"}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeImage("cover")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Chưa có ảnh bìa</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Tải lên ảnh bìa của nhà hàng. Khuyến nghị sử dụng hình ảnh có tỷ lệ 16:9, kích thước tối thiểu
                      1200x675px.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("cover-upload").click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Tải lên ảnh bìa
                      </Button>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange("cover", e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-2">
              <Button variant="outline" asChild>
                <Link to={`/d/restaurants/${restaurantInfo?.restaurantId}`}>Hủy</Link>
              </Button>
              <Button onClick={handleUpdate} disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
