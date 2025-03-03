import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Mail, MapPin, Phone, Camera, Edit, MapPinned, Clock, Star, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { generateAvatarInitial } from "@/utils/generateAvatarInitial";
import { useRestaurant } from "@/context/restaurant";
import { useUserRestaurants } from "@/hooks/use-user-restaurants";

export default function RestaurantInfoForm() {
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useRestaurant();

  const { restaurants } = useUserRestaurants();

  useEffect(() => {
    setRestaurantInfo(restaurants.find((r) => r.restaurantId === restaurantId));
    // test
    // console.log(resT.data[0]);
    setLoading(false);
  }, [restaurantId, restaurants]);

  if (loading) return <RestaurantInfoSkeleton />;
  if (error)
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-center text-red-500 font-medium">Lỗi: {error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w">
      <div className="relative w-full h-80 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden mb-8 shadow-md">
        {restaurantInfo?.coverUrl ? (
          <img
            src={restaurantInfo.coverUrl || "/placeholder.svg"}
            alt="Ảnh bìa nhà hàng"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
            <Camera className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">Chưa có ảnh bìa</p>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm font-medium">
            Đang hoạt động
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white">
            <CardHeader className="relative pb-0 pt-6">
              <div className="flex items-start">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md mr-4">
                  <AvatarImage src={restaurantInfo?.logoUrl} alt={restaurantInfo?.restaurantName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {generateAvatarInitial(restaurantInfo?.restaurantName || "?")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 mt-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {restaurantInfo?.restaurantName || "Chưa có tên"}
                  </h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Mail className="w-4 h-4 mr-1" />
                    <p className="text-sm">{restaurantInfo?.email || "Chưa có email"}</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-700">Điện thoại</h3>
                    <p className="text-gray-600">{restaurantInfo?.phoneNumber || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-700">Địa chỉ</h3>
                    <p className="text-gray-600">{restaurantInfo?.addressLine1 || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPinned className="w-5 h-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-700">Khu vực</h3>
                    <p className="text-gray-600">{restaurantInfo?.addressLine2 || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-center">
                <Link to={`/d/restaurants/${restaurantId}/suathongtin`}>
                  <Button className="px-8 gap-2">
                    <Edit className="w-4 h-4" />
                    Sửa thông tin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-lg rounded-xl overflow-hidden border-0 bg-white h-full">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Thống kê</h3>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm font-medium">Tổng món ăn</span>
                    </div>
                    <span className="font-bold text-lg">0</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm font-medium">Thời gian hoạt động</span>
                    </div>
                    <span className="font-bold text-lg">--:-- - --:--</span>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-primary mr-2" />
                      <span className="text-sm font-medium">Đánh giá</span>
                    </div>
                    <span className="font-bold text-lg">0.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RestaurantInfoSkeleton() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Skeleton className="w-full h-80 rounded-2xl mb-8" />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-0 pt-6">
              <div className="flex items-start">
                <Skeleton className="w-24 h-24 rounded-full mr-4" />
                <div className="flex-1 mt-2 space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="w-5 h-5 mr-3 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}

              <Skeleton className="h-10 w-40 mx-auto mt-6" />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-lg rounded-xl overflow-hidden h-full">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
