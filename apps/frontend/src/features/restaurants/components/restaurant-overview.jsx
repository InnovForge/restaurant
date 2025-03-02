import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getFoodsByRestaurantId, getRestaurant } from "../api/get-restaurant";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/ui/lazy-image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Plus } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import MenuRestaurants from "./menu-restaurants";
import { cn } from "@/utils/cn";
import { generateAvatarInitial } from "@/utils/generateAvatarInitial";
import { MapPin } from "lucide-react";
import { Clock } from "lucide-react";
import useCartStore from "@/stores/useCartStore";

const getCurrentOpeningHours = (openingHours) => {
  const today = new Date().getDay();
  const todayHours = openingHours.find((oh) => Number(oh.dayOfWeek) === today);

  return todayHours ? `${todayHours.openingTime} - ${todayHours.closingTime}` : "Không có thông tin";
};

const RestaurantOverview = () => {
  const { addCart } = useCartStore();
  let params = useParams();
  console.log("restaurantId", params.restaurantId);

  const { data, isFetching } = useQuery({
    queryKey: ["get-restaurant", params.restaurantId],
    queryFn: async () => {
      const res = await getRestaurant(params.restaurantId);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.restaurantId,
  });

  const { data: foods, isFetching: isFetchingFoods } = useQuery({
    queryKey: ["get-foods-by-restaurant-id", params.restaurantId],
    queryFn: async () => {
      const res = await getFoodsByRestaurantId(params.restaurantId);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!params.restaurantId,
  });

  const categoryRefs = useRef({});
  const [category, setCategory] = useState(null);
  const scrollRef = useRef(null);

  if (isFetching) {
    return <div>loading...</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="flex flex-row">
        <div className=" flex w-full flex-col relative">
          <div className="pt-[16%] h-0 relative rounded-md overflow-hidden">
            <div className="absolute top-0 left-0 block h-full w-full">
              <img src={data?.coverUrl} alt={data?.name} className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="py-4">
            <div className="flex gap-2">
              <Avatar className="w-20 h-20 md:w-32 md:h-32">
                <AvatarImage src={data?.logoUrl} />
                <AvatarFallback>{generateAvatarInitial(data?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <h2 className="md:text-3xl text-xl font-bold">{data.name}</h2>
                <div className="flex gap-2 items-center">
                  <MapPin className="w-4 h-4" />
                  <p className="md:text-sm text-xs">
                    Địa chỉ: {data?.addressLine1}
                    {data?.addressLine2 ? ", " + data.addressLine2 : ""}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">Giờ mở cửa: {getCurrentOpeningHours(data?.openingHours || [])}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Star color="red" className="w-4 h-4" />
                  <p className="text-sm">
                    {parseInt(data?.averageRating)} ({data?.totalReviews} đánh giá)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MenuRestaurants
        foods={foods}
        categoryRefs={categoryRefs}
        setCategory={setCategory}
        category={category}
        scrollRef={scrollRef}
      />
      <div className="flex flex-col">
        {foods?.map((item) => (
          <div
            key={item.foodCategoryId}
            className="mb-8"
            ref={(el) => (categoryRefs.current[item.foodCategoryId] = el)}
          >
            <h2 className="text-xl font-bold mb-2">{item.categoryName}</h2>

            <div
              className={cn(
                item?.foods?.length === 1 && "flex gap-4 w-fit max-w-[410px] justify-center",
                item?.foods?.length === 2 && "flex gap-4 justify-start [&>*]:max-w-[410px]",
                item?.foods?.length > 2 && "grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4",
              )}
            >
              {item?.foods?.map((food) => (
                <Card
                  key={food.foodId}
                  className={`flex flex-row gap-2 w-full ${food.available ? "" : "opacity-50 pointer-events-none"}`}
                >
                  <CardContent className="flex flex-row gap-2 p-2">
                    <LazyImage
                      src={food.foodImage}
                      alt={food.foodName}
                      className="object-cover w-full max-w-32 rounded-md"
                    />

                    <div key={food.foodId} className="flex gap-2 flex-col">
                      <h3 className="text-sm font-bold">{food.foodName}</h3>
                      <div className="flex items-center justify-start gap-1 w-full">
                        <Star color="red" className="w-4 h-4" />
                        <span className="text-sm">{parseInt(food.averageRating)}</span>
                        <p className="text-sm">{food.totalReviews ? `(${food.totalReviews})+` : ""}</p>
                      </div>
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: `${food.priceType}`,
                        }).format(food.price)}
                      </p>
                    </div>
                    <div className="flex mx-auto flex-col gap-2 justify-end">
                      <Button onClick={() => addCart(food)} size="icon" className="bg-primary rounded-full text-white">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantOverview;
