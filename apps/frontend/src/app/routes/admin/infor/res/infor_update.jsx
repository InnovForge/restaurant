import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { useRestaurant } from "@/context/restaurant";
export default function RestaurantUpdateInfoForm() {
  const [restaurantInfor, setRestaurantInfor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useRestaurant();

  // Lấy dữ liệu nhà hàng từ API
  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        const res = await api.get(`/v1/restaurants/${restaurantId}`);
        setRestaurantInfor(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        setError(err.response?.data?.message || "Không thể lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurantData();
  }, []);

  // Xử lý ảnh
  const [image, setImage] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Xử lý cập nhật thông tin
  const handleUpdate = async () => {
    try {
      const updatedData = {
        name: document.getElementById("name").value,
        phoneNumber: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: {
          addressLine1: document.getElementById("addressLine1").value,
          addressLine2: document.getElementById("addressLine2").value,
          longitude: document.getElementById("longitude").value,
          latitude: document.getElementById("latitude").value,
        },
      };

      const res = await api.patch(`/v1/restaurant/${restaurantId}`, updatedData);
      alert("Cập nhật thành công!");
      setRestaurantInfor(res.data.data);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhà hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin nhà hàng</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên nhà hàng :</Label>
                  <Input id="name" defaultValue={restaurantInfor?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email :</Label>
                  <Input id="email" defaultValue={restaurantInfor?.email || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại :</Label>
                  <Input id="phone" defaultValue={restaurantInfor?.phoneNumber || ""} />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-48 bg-gray-200 relative">
                  {image ? (
                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-400"></div>
                  )}
                </div>
                <Button className="w-32" onClick={() => document.getElementById("picture").click()}>
                  Thay đổi ảnh
                </Button>
                <Input id="picture" type="file" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Địa chỉ 1 :</Label>
                <Input id="addressLine1" defaultValue={restaurantInfor?.addressLine1 || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Địa chỉ 2 :</Label>
                <Input id="addressLine2" defaultValue={restaurantInfor?.addressLine2 || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Kinh độ :</Label>
                <Input id="longitude" defaultValue={restaurantInfor?.longitude || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Vĩ độ :</Label>
                <Input id="latitude" defaultValue={restaurantInfor?.latitude || ""} />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="w-32" onClick={handleUpdate}>
              Sửa
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
