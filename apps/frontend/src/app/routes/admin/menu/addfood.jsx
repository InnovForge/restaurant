import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload, X, ImagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useEffect } from "react";

const AddFood = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { restaurantId } = useRestaurant();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImage({
      file,
      preview: imageUrl,
    });

    // console.log("imageqqq", image);
  };

  // Sử dụng useEffect để theo dõi sự thay đổi của image
  useEffect(() => {
    console.log("imageqqq", image); // Log giá trị mới của image
  }, [image]); // Kích hoạt khi image thay đổi

  const removeImage = () => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const addFood = {
        name: formData.get("name"),
        price: Number(formData.get("price")),
        description: formData.get("description"),
      };

      // Kiểm tra các trường bắt buộc
      if (!addFood.name || !addFood.price || !addFood.description) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      // Thêm món ăn mới
      const res = await api.post(`/v1/restaurants/${restaurantId}/foods`, addFood);
      const foodId = res.data.data.id;

      // Nếu có ảnh, upload ảnh lên server
      if (image?.file) {
        const imageData = new FormData();
        imageData.append("image", image.file); // Key "image" phải khớp với API

        try {
          const res = await api.patch(`/v1/restaurants/${restaurantId}/foods/${foodId}/image`, imageData, {
            headers: {
              "Content-Type": "multipart/form-data", // Đảm bảo header đúng
            },
          });

          console.log("Upload ảnh thành công:", res.data); // Log kết quả từ API
          toast.success("Upload ảnh thành công!");
        } catch (err) {
          console.error("Lỗi upload ảnh:", err);
          toast.error("Lỗi upload ảnh: " + (err.response?.data?.message || "Vui lòng thử lại"));
        }
      }

      // Thông báo thành công
      toast.success("Thêm món ăn thành công!");

      // Reset form và ảnh
      e.target.reset();
      removeImage();
    } catch (err) {
      console.error("Lỗi thêm món:", err);
      toast.error(err.response?.data?.message || "Thêm món ăn thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:pl-8 lg:pr-20 min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/d/restaurants/${restaurantId}/menu`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Thêm Món Ăn Mới</h1>
            <p className="text-muted-foreground">Thêm món ăn mới vào thực đơn nhà hàng</p>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Thông tin món ăn</CardTitle>
            <CardDescription>Điền thông tin chi tiết về món ăn mới</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên món ăn</Label>
                    <Input id="name" name="name" placeholder="VD: Phở bò tái" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Giá bán</Label>
                    <div className="relative">
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="VD: 50000"
                        className="h-11 pl-8"
                      />
                      <span className="absolute left-3 top-3 text-muted-foreground">₫</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả món ăn</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Mô tả chi tiết về món ăn..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Hình ảnh món ăn</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
                    {image ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-300 transition-colors"
                        onClick={() => document.getElementById("picture").click()}
                      >
                        <div className="p-4 rounded-full bg-gray-50">
                          <ImagePlus className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Tải lên hình ảnh</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG hoặc GIF (tối đa 5MB)</p>
                        </div>
                      </div>
                    )}
                    <input id="picture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link to={`/d/restaurants/${restaurantId}/menu`}>Hủy</Link>
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                  {loading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm món ăn"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddFood;
