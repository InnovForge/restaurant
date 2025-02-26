import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useRestaurant } from "@/context/restaurant";
export default function RestaurantInfoForm() {
  const [restaurantInfor, setRestaurantInfor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useRestaurant();
  console.log("infor" + restaurantId);
  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        const res = await api.get(`/v1/restaurants/${restaurantId}`);
        console.log(res.data);
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

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin nhà hàng</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên nhà hàng :{restaurantInfor?.name || "Chưa có"}</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email :{restaurantInfor?.email || "null"}</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại :{restaurantInfor?.phoneNumber || "null"}</Label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">addressLine1 :{restaurantInfor?.addressLine1 || "null"}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">addressLine2 :{restaurantInfor?.addressLine2 || "null"}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">longitude :{restaurantInfor?.longitude || "null"}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">latitude :{restaurantInfor?.latitude || "null"}</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link to={`/d/restaurants/${restaurantId}/suathongtin`}>
              <Button className="w-32">Sửa thông tin</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
